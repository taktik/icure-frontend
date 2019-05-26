import * as fhcApi from 'fhc-api/dist/fhcApi'
import * as iccApi from 'icc-api/dist/icc-api/iccApi'
import * as iccXApi from 'icc-api/dist/icc-x-api/index'
import {UtilsClass} from "icc-api/dist/icc-x-api/crypto/utils"

import moment from 'moment/src/moment'
import levenshtein from 'js-levenshtein'
import * as models from "fhc-api/model/AcknowledgeType";



onmessage = e => {
    if(e.data.action === "loadEhboxMessage"){



        const iccHost           = e.data.iccHost
        const iccHeaders        = JSON.parse(e.data.iccHeaders)

        const fhcHost           = e.data.fhcHost
        const fhcHeaders        = JSON.parse(e.data.fhcHeaders)

        const tokenId           = e.data.tokenId
        const keystoreId        = e.data.keystoreId
        const user              = e.data.user
        const parentHcp         = e.data.parentHcp
        const ehpassword        = e.data.ehpassword
        const boxIds            = e.data.boxId
        const alternateKeystores= e.data.alternateKeystores
        const language          = e.data.language

        const ehboxApi          = new fhcApi.fhcEhboxcontrollerApi(fhcHost, fhcHeaders)
        const docApi            = new iccApi.iccDocumentApi(iccHost, iccHeaders)
        const msgApi            = new iccApi.iccMessageApi(iccHost, iccHeaders)
        const beResultApi       = new iccApi.iccBeresultimportApi(iccHost, iccHeaders)
        const iccHcpartyApi     = new iccApi.iccHcpartyApi(iccHost, iccHeaders)
        const iccPatientApi     = new iccApi.iccPatientApi(iccHost, iccHeaders)
        const iccContactApi		= new iccApi.iccContactApi(iccHost, iccHeaders)
        const iccCryptoXApi     = new iccXApi.IccCryptoXApi(iccHost, iccHeaders, iccHcpartyApi)
        const iccUtils          = new UtilsClass()

        //Avoid hitting local storage to load key pairs
        Object.keys(e.data.keyPairs).forEach( k => iccCryptoXApi.cacheKeyPair(e.data.keyPairs[k], k) )

        const iccDocumentXApi   = new iccXApi.IccDocumentXApi(iccHost, iccHeaders, iccCryptoXApi)
        const iccContactXApi	= new iccXApi.IccContactXApi(iccHost, iccHeaders,iccCryptoXApi)
        const iccFormXApi		= new iccXApi.IccFormXApi(iccHost, iccHeaders,iccCryptoXApi)
        const iccMessageXApi    = new iccXApi.IccMessageXApi(iccHost, iccHeaders, iccCryptoXApi)



        const createDbMessageWithAppendicesAndTryToAssign =  (message,boxId) => {
            return ehboxApi.getFullMessageUsingPOST(keystoreId, tokenId, ehpassword, boxId, _.trim(_.get(message,"id","")), alternateKeystores)
                .then(fullMessageFromEHealthBox => !_.trim(_.get(fullMessageFromEHealthBox,"id","")) ? Promise.resolve([]) : msgApi.findMessagesByTransportGuid(boxId+":"+message.id, null, null, null, 1).then(foundExistingMessage => [fullMessageFromEHealthBox, foundExistingMessage]).catch(e=>{console.log("ERROR with findMessagesByTransportGuid: ",e);}))
                .then(([fullMessageFromEHealthBox, foundExistingMessage]) => {

                    // Could be message couldn't be resolved, FHC answer: "Impossible to decrypt message using provided Keystores"
                    if(!_.trim(_.get(fullMessageFromEHealthBox,"id",""))) return Promise.resolve([])

                    // Found existing message
                    return !!_.size(_.get(foundExistingMessage,"rows",[])) ?
                        // Older then a month ? Delete from e-Health Box
                        !!(parseInt(_.get(_.head(_.get(foundExistingMessage,"rows",[])),"created",Date.now())) < (Date.now() - (31 * 24 * 3600000))) ?
                            removeMsgFromEhboxServer(_.head(_.get(foundExistingMessage,"rows",[]))) :
                            Promise.resolve([])
                        :
                            // Message doesn't exist yet, create locally
                            // registerNewMessage(fullMessageFromEHealthBox, boxId).then(([createdMessage, annexDocs]) => tryToAssignAppendices(createdMessage, fullMessageFromEHealthBox, annexDocs, boxId))
                            registerNewMessage(fullMessageFromEHealthBox, boxId).then(([createdMessage, annexDocs]) => Promise.resolve([createdMessage, annexDocs]))

                })
                .catch(e=>{console.log("ERROR with createDbMessageWithAppendicesAndTryToAssign: ",e); return Promise.resolve([])})
        }

        const removeMsgFromEhboxServer = (icureMessageToDelete) => {

            const sourceBox = _.trim(_.get(_.trim(_.get(icureMessageToDelete,"transportGuid","")).split(':'),"[0]","")).toUpperCase()
            const destinationBox = sourceBox === 'INBOX' ? 'BININBOX' : sourceBox === 'SENTBOX' ? 'BINSENTBOX' : null
            const eHealthBoxMessageId = _.trim(_.get(_.trim(_.get(icureMessageToDelete,"transportGuid","")).split(':'),"[1]",""))

            return !_.size(icureMessageToDelete) || !sourceBox || !destinationBox || !eHealthBoxMessageId ?
                Promise.resolve([]) :
                !!sourceBox.startsWith("BIN") ?
                    ehboxApi.deleteMessagesUsingPOST(keystoreId, tokenId, ehpassword, [eHealthBoxMessageId], sourceBox).then(x=>x).catch(e=>{console.log("ERROR with deleteMessagesUsingPOST: ",e); return Promise.resolve([]);}) :
                    ehboxApi.moveMessagesUsingPOST(keystoreId, tokenId, ehpassword, [eHealthBoxMessageId], sourceBox, destinationBox).then(x=>x).catch(e=>{console.log("ERROR with moveMessagesUsingPOST: ",e); return Promise.resolve([]);})

        }

        const registerNewMessage = (fullMessage, boxId) => {

            // Unread by default
            let finalMessageStatus = _.get(fullMessage,"status",(1<<1))

            // Eval important, cyrpted & has annexes
            finalMessageStatus = !!_.get(fullMessage,"important",false) ? finalMessageStatus|1<<2 : finalMessageStatus
            finalMessageStatus = !!_.get(fullMessage,"encrypted",false) ? finalMessageStatus|1<<3 : finalMessageStatus
            finalMessageStatus = !!_.size(_.get(fullMessage,"annex",[])) ? finalMessageStatus|1<<4 : finalMessageStatus

            return iccMessageXApi.newInstance(_.omit(user, ['autoDelegations']), {
                created: moment(_.get(fullMessage,"publicationDateTime",_.trim(moment().format("YYYYMMDD"))), "YYYYMMDD").valueOf(),
                fromAddress: !_.size(_.get(fullMessage,"sender",{})) ? "" : _.trim(_.compact([
                    _.trim(_.trim(_.get(fullMessage,"sender.lastName","")?_.trim(_.get(fullMessage,"sender.lastName","")):_.get(fullMessage,"customMetas.CM-AuthorLastName",""))),
                    _.trim(_.trim(_.get(fullMessage,"sender.firstName","")?_.trim(_.get(fullMessage,"sender.firstName","")):_.get(fullMessage,"customMetas.CM-AuthorFirstName",""))),
                    (!_.trim(_.get(fullMessage,"sender.lastName",""))&& !_.trim(_.get(fullMessage,"customMetas.CM-AuthorLastName",""))?_.trim(_.get(fullMessage,"sender.organizationName","")):""),
                    "(" + _.compact([
                        _.trim(_.trim(_.get(fullMessage,"sender.identifierType.type","")?_.trim(_.get(fullMessage,"sender.identifierType.type","")):_.get(fullMessage,"customMetas.CM-SenderIDType",""))),
                        _.trim(_.trim(_.get(fullMessage,"sender.id","")?_.trim(_.get(fullMessage,"sender.id","")):_.get(fullMessage,"customMetas.CM-SenderID","")))
                    ]).join(": ") + ")"
                ]).join(" ")),
                subject: _.trim(_.get(fullMessage,"document.title",_.trim(_.get(fullMessage,"document.textContent",_.trim(_.get(fullMessage,"id","")))).substring(0,26)+"...")),
                metas: _.merge(_.get(fullMessage,"customMetas",{}), {patientSsin: _.trim(_.get(fullMessage,"patientInss",""))}),
                toAddresses: [boxId],
                transportGuid: boxId + ":" + _.get(fullMessage,"id",""),
                fromHealthcarePartyId: _.trim(_.get(fullMessage,"fromHealthcarePartyId", _.get(fullMessage,"sender.id",""))),
                received: +new Date,
                status: finalMessageStatus
            })
                .then(messageInstance => msgApi.createMessage(messageInstance))
                .then(createdMessage => {
                    const documentAndAnnexesPromises = _.compact(_.concat(_.get(fullMessage,"document",[]),_.get(fullMessage,"annex",[]))).map(documentAndAnnexes => _.size(documentAndAnnexes) ? registerNewDocument(documentAndAnnexes, createdMessage, fullMessage) : Promise.resolve([])).filter(x=>!!x)
                    return Promise.all(documentAndAnnexesPromises)
                    .then(annexDocs => [createdMessage, annexDocs])
                    .catch(e => iccMessageXApi.message().deleteMessages(createdMessage.id).then((x)=>x).catch(e => { console.log("ERROR with deleteMessages: ", e); return Promise.resolve([]) }))
                })

        }

        const registerNewDocument = (documentAndAnnexes, createdMessage, fullMessage) => {
            return !_.size(documentAndAnnexes) || !_.size(createdMessage) || !_.size(fullMessage) ?
                Promise.resolve([]) :
                iccDocumentXApi.newInstance(user, createdMessage, {
                    documentLocation: (!!_.get(fullMessage,"document", false) && _.get(documentAndAnnexes,"content","something") === _.get(fullMessage,"document.content","else")) ? 'body' : 'annex',
                    documentType: 'result',
                    mainUti: iccDocumentXApi.uti(_.get(documentAndAnnexes,"mimeType",""), _.trim(_.get(documentAndAnnexes,"filename","document.txt")).replace(/.+\.(.+)/, '$1')),
                    name: _.trim(_.get(documentAndAnnexes,"filename","document.txt"))
                })
                    .then(d => docApi.createDocument(d).catch(e => { console.log("ERROR with createDocument: ", e); return Promise.resolve([]) }))
                    .then(createdDocument => [createdDocument, iccUtils.base64toArrayBuffer(_.get(documentAndAnnexes,"content",""))]).catch(e => { console.log("ERROR with base64toArrayBuffer: ", e); return Promise.resolve([]) })
                    .then(([createdDocument, byteContent]) => iccCryptoXApi.extractKeysFromDelegationsForHcpHierarchy(user.healthcarePartyId,createdDocument.id,_.get(createdDocument,"encryptionKeys", _.get(createdDocument,"delegations",null)))
                        .then(({extractedKeys: enckeys}) => docApi.setAttachment(createdDocument.id, enckeys.join(','), byteContent).catch(e => { console.log("ERROR with setAttachment: ", e); return Promise.resolve([]) }))
                        .then(() => createdDocument)
                        .catch(e => { console.log("ERROR with createDocument: ", e); return Promise.resolve([]) })
                    )
                    .catch(e => { console.log("ERROR with deleteMessages: ", e); return Promise.resolve([]) })
        }










        const assignResult = (message,docInfo,document) => {
            // return {id: contactId, protocolId: protocolIdString} if success else null (in promise)

            const filter = docInfo.ssin && docInfo.ssin.match(/[0-9]{11}/) ? {
                '$type': 'PatientByHcPartyAndSsinFilter',
                'healthcarePartyId': parentHcp.id,
                'ssin': docInfo.ssin
            } : {
                '$type': 'UnionFilter',
                'healthcarePartyId': parentHcp.id,
                'filters': [
                    {
                        '$type': 'IntersectionFilter',
                        'healthcarePartyId': parentHcp.id,
                        'filters': [{
                            '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
                            'healthcarePartyId': parentHcp.id,
                            'searchString': docInfo.lastName
                        },{
                            '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
                            'healthcarePartyId': parentHcp.id,
                            'searchString': docInfo.firstName
                        }]
                    }, {
                        '$type': 'PatientByHcPartyDateOfBirthFilter',
                        'healthcarePartyId': parentHcp.id,
                        'dateOfBirth': docInfo.dateOfBirth
                    }

                ]
            }

            return iccPatientApi.filterByWithUser(user, null, null, 20, 0, null, null, {filter: filter}).then(({rows}) => {
                const candidates = rows.filter(p => {
                    const pFn =  p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/)[0]
                    const lFn =  docInfo.firstName && docInfo.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/,'')
                    const pLn =  p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/)[0]
                    const lLn =  docInfo.lastName && docInfo.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/,'')

                    return (docInfo.ssin && p.ssin && docInfo.ssin === p.ssin) ||
                        (pFn && lFn && pLn && lLn && p.dateOfBirth && docInfo.dateOfBirth && (levenshtein(pFn,lFn) < 2 && levenshtein(pLn,lLn) < 3 && p.dateOfBirth === docInfo.dateOfBirth)) ||
                        (pFn && lFn && p.dateOfBirth && docInfo.dateOfBirth && (pFn === lFn && p.dateOfBirth === docInfo.dateOfBirth)) ||
                        (pLn && lLn && p.dateOfBirth && docInfo.dateOfBirth && (pLn === lLn && p.dateOfBirth === docInfo.dateOfBirth)) ||
                        (pFn && lFn && pLn && lLn && (pLn === lLn && pFn === lFn))
                })

                return (candidates.length !== 1)  ?
                    Promise.resolve(null) :
                    iccContactXApi.newInstance(user, candidates[0], {
                        groupId: message.id,
                        created: +new Date,
                        modified: +new Date,
                        author: user.id,
                        responsible: user.healthcarePartyId,
                        openingDate: moment(docInfo.demandDate).format('YYYYMMDDHHmmss') || '',
                        closingDate: moment().format('YYYYMMDDHHmmss') || '',
                        encounterType: {
                            type: docInfo.codes.type,
                            version: docInfo.codes.version,
                            code: docInfo.codes.code
                        },
                        descr: docInfo.labo,
                        tags: [{type: 'CD-TRANSACTION', code: 'labresult'}],
                        subContacts: []
                    }).then(c => {
                        c.services.push({
                            id: iccCryptoXApi.randomUuid(),
                            label: 'labResult',
                            valueDate: parseInt(moment().format('YYYYMMDDHHmmss')),
                            content: _.fromPairs([[language, {stringValue: docInfo.labo}]]),
                            tags: [{type: 'CD-TRANSACTION', code: 'labresult'}]
                        })
                        return iccContactXApi.createContactWithUser(user, c)
                    }).then(c => {
                        return iccFormXApi.newInstance(user, candidates[0], {
                            contactId: c.id,
                            descr: "Lab " + +new Date,
                        }).then(f => {
                            return iccFormXApi.createForm(f).then(f =>
                                iccCryptoXApi
                                    .extractKeysFromDelegationsForHcpHierarchy(
                                        user.healthcarePartyId,
                                        document.id,
                                        _.size(document.encryptionKeys) ? document.encryptionKeys : document.delegations
                                    )
                                    .then(({extractedKeys: enckeys}) => beResultApi.doImport(document.id, user.healthcarePartyId, language, docInfo.protocol, f.id, null, enckeys.join(','), c))
                            )
                        })
                    }).then(c => {
                        console.log("did import ", c, docInfo)
                        return {id: c.id, protocolId: docInfo.protocol}
                    }).catch(err => {
                        console.log(err)
                    })

            })
        } // assignResult end

        const tryToAssignAppendices = (createdMessage, fullMessage, annexDocs, boxId) => {
            if (boxId === "INBOX" && annexDocs) { // only import annexes in inbox
                let results = _.flatten(annexDocs.filter(doc => doc.documentLocation !== "body").map(doc => {
                    return tryToAssignAppendix(fullMessage, doc)
                }))

                return Promise.all(results)
                    .then (reslist => {
                        let assignedMap = {}
                        let unassignedList = []
                        _.flatten(reslist).forEach(result => {
                            if (result.assigned) {
                                assignedMap[result.contactId] = result.protocolId
                            } else {
                                unassignedList.push(result.protocolId)
                            }
                        })
                        createdMessage.unassignedResults = unassignedList
                        createdMessage.assignedResults = assignedMap

                        return msgApi.modifyMessage(createdMessage)
                    })
            } else {
                return Promise.resolve()
            }
        }

        const tryToAssignAppendix = (fullMessage, createdDocument) => {
            // console.log('tryToAssignAppendix',fullMessage,createdDocument)
            return iccCryptoXApi
                .extractKeysFromDelegationsForHcpHierarchy(
                    user.healthcarePartyId,
                    createdDocument.id,
                    _.size(createdDocument.encryptionKeys) ? createdDocument.encryptionKeys : createdDocument.delegations
                )
                .then(({extractedKeys: enckeys}) => beResultApi.getInfos(createdDocument.id, false, null, enckeys.join(',')))
                .then(docInfos => {
                    console.log('tryToAssignAppendix',fullMessage,createdDocument,docInfos)
                    return Promise.all(
                        docInfos.map(docInfo => {
                           return assignResult(fullMessage, docInfo, createdDocument).then(result => {
                               if(result != null) {
                                   console.log('result',result)
                                   return {assigned: true, protocolId: result.protocolId, contactId: result.id}
                               } else {
                                   return {assigned: false, protocolId: docInfo.protocol, contactId: null}
                               }
                           })
                        } )
                    )
                })
                .catch(err => {
                    return []
                })
        }








        let prom = Promise.resolve([])
        let treatedEHealthBoxMessage = []
        _.map((boxIds||[]), singleBoxId => ehboxApi.loadMessagesUsingPOST(keystoreId, tokenId, ehpassword, singleBoxId, 200, alternateKeystores).then(messagesFromEHealthBox => {
            _.map(_.filter(messagesFromEHealthBox, m => !!_.trim(_.get(m, "id",""))), singleMessage => prom = prom
                .then((treatedEHealthBoxMessage) => createDbMessageWithAppendicesAndTryToAssign(singleMessage, singleBoxId))
                .then(([createdMessage, annexDocs]) => {})
                .catch((e) => console.log("ERROR with createDbMessageWithAppendicesAndTryToAssign: ", e))
                .finally(()=> _.concat(treatedEHealthBoxMessage, []))
            )
        }))






    }
};