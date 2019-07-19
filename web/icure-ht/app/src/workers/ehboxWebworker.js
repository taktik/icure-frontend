import * as fhcApi from 'fhc-api/dist/fhcApi'
import * as iccApi from 'icc-api/dist/icc-api/iccApi'
import * as iccXApi from 'icc-api/dist/icc-x-api/index'
import {UtilsClass} from "icc-api/dist/icc-x-api/crypto/utils"

import moment from 'moment/src/moment'
import levenshtein from 'js-levenshtein'
import { Base64 } from 'js-base64';



onmessage = e => {
    if(e.data.action === "loadEhboxMessage"){



        const iccHost               = e.data.iccHost
        const iccHeaders            = JSON.parse(e.data.iccHeaders)

        const fhcHost               = e.data.fhcHost
        const fhcHeaders            = JSON.parse(e.data.fhcHeaders)

        const tokenId               = e.data.tokenId
        const keystoreId            = e.data.keystoreId
        const user                  = e.data.user
        const parentHcp             = e.data.parentHcp
        const ehpassword            = e.data.ehpassword
        const boxIds                = e.data.boxId
        const alternateKeystores    = e.data.alternateKeystores
        const language              = e.data.language

        const iccPatientApi         = new iccApi.iccPatientApi(iccHost, iccHeaders)
        const ehboxApi              = new fhcApi.fhcEhboxcontrollerApi(fhcHost, fhcHeaders)
        const docApi                = new iccApi.iccDocumentApi(iccHost, iccHeaders)
        const msgApi                = new iccApi.iccMessageApi(iccHost, iccHeaders)
        const beResultApi           = new iccApi.iccBeResultImportApi(iccHost, iccHeaders)
        const iccHcpartyApi         = new iccApi.iccHcpartyApi(iccHost, iccHeaders)
        const accesslogApi          = new iccApi.iccAccesslogApi(iccHost, iccHeaders)
        const iccCryptoXApi         = new iccXApi.IccCryptoXApi(iccHost, iccHeaders, iccHcpartyApi,iccPatientApi)
        const iccUtils              = new UtilsClass()
        const icureApi              = new iccApi.iccIcureApi(iccHost, iccHeaders)
        const iccEntityrefApi       = new iccApi.iccEntityrefApi(iccHost, iccHeaders)
        const iccInsuranceApi       = new iccApi.iccInsuranceApi(iccHost, iccHeaders)

        //Avoid hitting local storage when loading key pairs
        Object.keys(e.data.keyPairs).forEach( k => iccCryptoXApi.cacheKeyPair(e.data.keyPairs[k], k) )

        const iccHcpartyXApi        = new iccXApi.IccHcpartyXApi(iccHost, iccHeaders)
        const iccDocumentXApi       = new iccXApi.IccDocumentXApi(iccHost, iccHeaders, iccCryptoXApi)
        const iccContactXApi	    = new iccXApi.IccContactXApi(iccHost, iccHeaders,iccCryptoXApi)
        const iccHelementXApi  	    = new iccXApi.IccHelementXApi(iccHost, iccHeaders,iccCryptoXApi)
        const iccReceiptXApi	    = new iccXApi.IccReceiptXApi(iccHost, iccHeaders,iccCryptoXApi)
        const iccIccInvoiceXApi     = new iccXApi.IccInvoiceXApi(iccHost, iccHeaders,iccCryptoXApi, iccEntityrefApi)
        const iccClassificationXApi = new iccXApi.IccClassificationXApi(iccHost, iccHeaders,iccCryptoXApi)

        const iccFormXApi		    = new iccXApi.IccFormXApi(iccHost, iccHeaders,iccCryptoXApi)
        const iccPatientXApi        = new iccXApi.IccPatientXApi(iccHost, iccHeaders, iccCryptoXApi, iccContactXApi, iccHelementXApi, iccIccInvoiceXApi, iccDocumentXApi, iccHcpartyXApi, iccClassificationXApi)
        const iccMessageXApi        = new iccXApi.IccMessageXApi(iccHost, iccHeaders, iccCryptoXApi, iccInsuranceApi, iccEntityrefApi, iccIccInvoiceXApi, iccDocumentXApi, iccReceiptXApi, iccPatientXApi)

        let totalNewMessages = {
            INBOX: 0,
            SENTBOX: 0
        }

        let appVersions = {
            backend: "-",
            frontend: "[AIV]{version}[/AIV]",
            electron: "-",
            isElectron: false
        }



        const createDbMessageWithAppendicesAndTryToAssign =  (message,boxId) => {

            const promResolve = Promise.resolve()
            return ehboxApi.getFullMessageUsingPOST(keystoreId, tokenId, ehpassword, boxId, _.trim(_.get(message,"id","")), alternateKeystores)
                .then(fullMessageFromEHealthBox => !_.trim(_.get(fullMessageFromEHealthBox,"id","")) ?
                    promResolve :
                    msgApi.findMessagesByTransportGuid(boxId+":"+_.trim(_.get(message,"id","")), null, null, null, 1)
                        .then(foundExistingMessage => [fullMessageFromEHealthBox, foundExistingMessage])
                        .catch(e=>{console.log("ERROR with findMessagesByTransportGuid: ",e); return promResolve;})
                )
                .then(([fullMessageFromEHealthBox, foundExistingMessage]) => !_.trim(_.get(fullMessageFromEHealthBox,"id","")) ?
                    promResolve : // Could be message couldn't be decrypted due to obsolete keystores
                    convertFromOldToNewSystemAndCarryOn(boxId, fullMessageFromEHealthBox, _.head(_.get(foundExistingMessage,"rows",[{}])))
                )
                .catch(e=>{console.log("ERROR with createDbMessageWithAppendicesAndTryToAssign: ",e); return promResolve;})

        }

        const removeMsgFromEhboxServer = (icureMessageToDeleted) => {

            const promResolve = Promise.resolve()
            const sourceBox = _.trim(_.get(_.trim(_.get(icureMessageToDeleted,"transportGuid","")).split(':'),"[0]","")).toUpperCase()
            const destinationBox = sourceBox === 'INBOX' ? 'BININBOX' : sourceBox === 'SENTBOX' ? 'BINSENTBOX' : null
            const eHealthBoxMessageId = _.trim(_.get(_.trim(_.get(icureMessageToDeleted,"transportGuid","")).split(':'),"[1]",""))

            return !_.size(icureMessageToDeleted) || !sourceBox || !destinationBox || !eHealthBoxMessageId ?
                promResolve :
                !!sourceBox.startsWith("BIN") ?
                    ehboxApi.deleteMessagesUsingPOST(keystoreId, tokenId, ehpassword, [eHealthBoxMessageId], sourceBox).then(x=>x).catch(e=>{console.log("ERROR with deleteMessagesUsingPOST: ",e); return promResolve;}) :
                    ehboxApi.moveMessagesUsingPOST(keystoreId, tokenId, ehpassword, [eHealthBoxMessageId], sourceBox, destinationBox).then(x=>x).catch(e=>{console.log("ERROR with moveMessagesUsingPOST: ",e); return promResolve;})

        }

        const backupOriginalMessage = (fullMessageFromEHealthBox) => {
            const promResolve = Promise.resolve()
            return iccMessageXApi.newInstance(_.omit(user, ['autoDelegations']), { received: +new Date, transportGuid: "ehBoxBackup" + ":" + _.get(fullMessageFromEHealthBox,"id","") })
                .then(messageInstance => msgApi.createMessage(messageInstance))
                .then(createdMessage => iccDocumentXApi.newInstance(user, createdMessage, {documentType: 'result', mainUti: "application/octet-stream", name: _.get(fullMessageFromEHealthBox,"id","") + ".json"}))
                .then(documentInstance => docApi.createDocument(documentInstance))
                .then(createdDocument => encryptContent( user, createdDocument, fullMessageFromEHealthBox ).then(encryptedContent => ([createdDocument,encryptedContent])))
                .then(([createdDocument, encryptedContent]) => docApi.setAttachment(createdDocument.id, null, encryptedContent))
                .catch(e=>{ console.log("ERROR with backupOriginalMessage:", e); return promResolve; })
        }

        const registerNewMessage = (fullMessageFromEHealthBox, boxId) => {

            const promResolve = Promise.resolve()
            const ehBoxAnnexes = _.get(fullMessageFromEHealthBox,"annex",[])
            const labResultHeaderRegExp = /A1\\.*\\.*([\\])*([.*])*/gi
            const a1HeadersByAnnexesKey = _.map(ehBoxAnnexes, singleAnnex => _.trim(_.get(singleAnnex,"textContent","")).match(labResultHeaderRegExp))
            const splittedEhBoxAnnexes = _.flatMap(_.map(ehBoxAnnexes, (singleAnnex,annexKey) => ( !_.size(a1HeadersByAnnexesKey[annexKey]) || _.size(a1HeadersByAnnexesKey[annexKey]) === 1 ) ?
                [singleAnnex] : // Not a lab result OR lab result with only one patient, let go as such
                _.map(_.compact(_.trim(_.get(singleAnnex,"textContent","")).split(labResultHeaderRegExp)), (v,k)=> a1HeadersByAnnexesKey[annexKey][k] + v).map(singlePatientContent=> _.merge({}, singleAnnex, {textContent:singlePatientContent, content:Base64.encode(singlePatientContent)})) // Split one annex's pats in distinct annexES
            ))

            // Unread by default
            let finalMessageStatus = _.get(fullMessageFromEHealthBox,"status",(1<<1))
            finalMessageStatus = !!_.get(fullMessageFromEHealthBox,"important",false) ? finalMessageStatus|1<<2 : finalMessageStatus
            finalMessageStatus = !!_.get(fullMessageFromEHealthBox,"encrypted",false) ? finalMessageStatus|1<<3 : finalMessageStatus
            finalMessageStatus = !!_.size(_.get(fullMessageFromEHealthBox,"annex",[])) ? finalMessageStatus|1<<4 : finalMessageStatus

            return backupOriginalMessage(fullMessageFromEHealthBox)
                .then((backupDocumentObject) => iccMessageXApi.newInstance(_.omit(user, ['autoDelegations']), {
                    created: moment(_.trim(_.get(fullMessageFromEHealthBox,"publicationDateTime",_.trim(moment().format("YYYYMMDD")))), "YYYYMMDD").valueOf(),
                    fromAddress: !_.size(_.get(fullMessageFromEHealthBox,"sender",{})) ? "" : _.trim(_.compact([
                        _.trim(_.trim(_.get(fullMessageFromEHealthBox,"sender.lastName","")?_.trim(_.get(fullMessageFromEHealthBox,"sender.lastName","")):_.get(fullMessageFromEHealthBox,"customMetas.CM-AuthorLastName",""))),
                        _.trim(_.trim(_.get(fullMessageFromEHealthBox,"sender.firstName","")?_.trim(_.get(fullMessageFromEHealthBox,"sender.firstName","")):_.get(fullMessageFromEHealthBox,"customMetas.CM-AuthorFirstName",""))),
                        (!_.trim(_.get(fullMessageFromEHealthBox,"sender.lastName",""))&& !_.trim(_.get(fullMessageFromEHealthBox,"customMetas.CM-AuthorLastName",""))?_.trim(_.get(fullMessageFromEHealthBox,"sender.organizationName","")):""),
                        "(" + _.compact([
                            _.trim(_.trim(_.get(fullMessageFromEHealthBox,"sender.identifierType.type","")?_.trim(_.get(fullMessageFromEHealthBox,"sender.identifierType.type","")):_.get(fullMessageFromEHealthBox,"customMetas.CM-SenderIDType",""))),
                            _.trim(_.trim(_.get(fullMessageFromEHealthBox,"sender.id","")?_.trim(_.get(fullMessageFromEHealthBox,"sender.id","")):_.get(fullMessageFromEHealthBox,"customMetas.CM-SenderID","")))
                        ]).join(": ") + ")"
                    ]).join(" ")),
                    subject: _.trim(_.get(fullMessageFromEHealthBox,"document.title",_.trim(_.get(fullMessageFromEHealthBox,"document.textContent",_.trim(_.get(fullMessageFromEHealthBox,"id","")))).substring(0,26)+"...")),
                    metas: _.merge(_.get(fullMessageFromEHealthBox,"customMetas",{}), {
                        patientSsin: _.trim(_.get(fullMessageFromEHealthBox,"patientInss","")),
                        backupOriginalMessageDocumentId:_.trim(_.get(backupDocumentObject,"id","")),
                        appVersions: JSON.stringify(appVersions)
                    }),
                    toAddresses: [boxId],
                    transportGuid: boxId + ":" + _.get(fullMessageFromEHealthBox,"id",""),
                    fromHealthcarePartyId: _.trim(_.get(fullMessageFromEHealthBox,"fromHealthcarePartyId", _.get(fullMessageFromEHealthBox,"sender.id",""))),
                    received: +new Date,
                    status: finalMessageStatus
                })
                    .then(messageInstance => msgApi.createMessage(messageInstance))
                    .then(createdMessage => {

                        let prom = Promise.resolve();
                        _.map(_.compact(_.concat(_.get(fullMessageFromEHealthBox,"document",[]),splittedEhBoxAnnexes)), singleDocumentOrAnnex => {
                            prom = prom.then(promisesCarrier => !!_.size(singleDocumentOrAnnex) ?
                                registerNewDocument(singleDocumentOrAnnex, createdMessage, fullMessageFromEHealthBox)
                                    .then(createdDocument => _.concat(promisesCarrier, createdDocument))
                                    .catch(e => { console.log("ERROR with registerNewDocument: ", e); return Promise.resolve(_.concat(promisesCarrier, {})); })
                                : Promise.resolve(_.concat(promisesCarrier, {}))
                            )
                        })

                        return prom
                            .then(createdDocuments => ([createdMessage, _.compact(createdDocuments)]))
                            .catch(e=>{ console.log("ERROR with registerNewDocument: ", e); return iccMessageXApi.message().deleteMessages(createdMessage.id).catch(e => {console.log("ERROR with deleteMessages: ", e); return promResolve;}) })
                    })
            )

        }

        const registerNewDocument = (singleDocumentOrAnnex, createdMessage, fullMessageFromEHealthBox) => {

            const promResolve = Promise.resolve()
            return !_.size(singleDocumentOrAnnex) || !_.size(createdMessage) || !_.size(fullMessageFromEHealthBox) || ( !_.trim(Base64.decode(_.get(singleDocumentOrAnnex,"content",""))) && !_.trim(_.get(singleDocumentOrAnnex,"textContent","")) ) ?
                promResolve :
                iccDocumentXApi.newInstance(user, createdMessage, {
                    documentLocation: (!!_.get(fullMessageFromEHealthBox,"document", false) && _.get(singleDocumentOrAnnex,"content","something") === _.get(fullMessageFromEHealthBox,"document.content","else")) ? 'body' : 'annex',
                    documentType: 'result',
                    mainUti: iccDocumentXApi.uti(_.get(singleDocumentOrAnnex,"mimeType",""), _.trim(_.get(singleDocumentOrAnnex,"filename","document.txt")).replace(/.+\.(.+)/, '$1')),
                    name: _.trim(_.get(singleDocumentOrAnnex,"filename","document.txt"))
                })
                    .then(d => docApi.createDocument(d).catch(e => { console.log("ERROR with createDocument: ", e); return promResolve; }))
                    .then(createdDocument => [createdDocument, iccUtils.base64toArrayBuffer(_.get(singleDocumentOrAnnex,"content",""))])
                    .then(([createdDocument, byteContent]) => iccCryptoXApi.extractKeysFromDelegationsForHcpHierarchy(user.healthcarePartyId,createdDocument.id,_.size(_.get(createdDocument,"encryptionKeys",{})) ? createdDocument.encryptionKeys : _.get(createdDocument,"delegations",{}))
                        .then(({extractedKeys: enckeys}) => docApi.setAttachment(createdDocument.id, enckeys.join(','), byteContent).catch(e => { console.log("ERROR with setAttachment: ", e); return promResolve; }))
                        .then(() => createdDocument)
                        .catch(e => { console.log("ERROR with extractKeysFromDelegationsForHcpHierarchy: ", e); return promResolve; })
                    )
                    .catch(e => { console.log("ERROR with base64toArrayBuffer: ", e); return promResolve; })

        }

        const tryToAssignAppendices = (createdMessage, fullMessageFromEHealthBox, createdDocumentsToAssign, boxId) => {

            let prom = Promise.resolve();
            const promResolve = Promise.resolve()
            const annexesToAssign = _.filter(createdDocumentsToAssign,doc => _.trim(_.get(doc,"documentLocation","body")) !== "body")
            const totalAnnexesToAssign = parseInt(_.size(annexesToAssign))
            if(boxId !== "INBOX" || !createdDocumentsToAssign) return promResolve


            _.map(annexesToAssign, createdDocumentToAssign => {
                prom = prom.then(promisesCarrier => !_.trim(_.get(createdDocumentToAssign,"id","")) ?
                    Promise.resolve(_.concat(promisesCarrier, {})) :
                    tryToAssignAppendix(fullMessageFromEHealthBox, createdDocumentToAssign)
                        .then(assignResult => _.concat(promisesCarrier, assignResult))
                        .catch(e=>{console.log("ERROR with tryToAssignAppendix: ", e); return Promise.resolve(_.concat(promisesCarrier, {}));})
                )
            })

            return prom
                .then( tryToAssignAppendixResults => {
                    let assignedMap = {}; let unassignedList = [];  let annexesInfos = [];
                    _.map(_.compact(tryToAssignAppendixResults), singleAssignResult => {

                        if (!!_.get(singleAssignResult,"assigned",false)) {
                            assignedMap[_.trim(_.get(singleAssignResult,"contactId",""))] = _.trim(_.get(singleAssignResult,"protocolId",""))
                            accesslogApi.createAccessLog({
                                id: iccCryptoXApi.randomUuid(),
                                patientId: _.trim(_.get(singleAssignResult,"patientId","")),
                                user: _.trim(_.get(user,"id","")),
                                date: +new Date(),
                                accessType: 'USER_ACCESS'
                            }).catch(e=>console.log("ERROR with createAccessLog: ", e))
                        } else {
                            unassignedList.push(singleAssignResult.protocolId)
                        }

                        annexesInfos.push({
                            isAssigned: !!_.get(singleAssignResult,"assigned",false),
                            patientId: _.trim(_.get(singleAssignResult,"patientId","")),
                            protocolId: _.trim(_.get(singleAssignResult,"protocolId","")),
                            contactId: _.trim(_.get(singleAssignResult,"contactId","")),
                            documentId: _.trim(_.get(singleAssignResult,"documentId","")),
                            docInfo: {
                                dateOfBirth: _.trim(_.get(singleAssignResult,"docInfo.dateOfBirth","")),
                                firstName: _.trim(_.get(singleAssignResult,"docInfo.firstName","")),
                                lastName: _.trim(_.get(singleAssignResult,"docInfo.lastName","")),
                                sex: _.trim(_.get(singleAssignResult,"docInfo.sex","")),
                                ssin: _.trim(_.get(singleAssignResult,"docInfo.ssin","")),
                                labo: _.trim(_.get(singleAssignResult,"docInfo.labo",""))
                            }
                        })

                    })

                    const totalAssignedAnnexes = parseInt(_.size(_.filter(annexesInfos,{isAssigned:true})))
                    const messageCurrentStatus = _.get(createdMessage,"status",0)
                    const messageStatus = (!!totalAnnexesToAssign && totalAnnexesToAssign === totalAssignedAnnexes) ? (messageCurrentStatus | (1<<20)) | (1<<26) : messageCurrentStatus   // All annexes assigned ? Set both STATUS_SHOULD_BE_DELETED_ON_SERVER (20) && STATUS_TRAITED (26)

                    return encryptContent( user, createdMessage, annexesInfos )
                        .then(encryptedContent => msgApi.modifyMessage(_.merge( {}, createdMessage, { status: messageStatus, metas: _.merge( {}, _.get(createdMessage,"metas",{}) , {annexesInfos: Base64.encode(String.fromCharCode.apply(null, new Uint8Array(encryptedContent)))}) })).catch(e=>{ console.log("ERROR with modifyMessage: ", e); return promResolve; }))
                        .catch(e=>{ console.log("ERROR with encryptContent: ", e); return msgApi.modifyMessage( _.merge( {}, createdMessage, { status: messageStatus, unassignedResults: unassignedList, assignedResults: assignedMap })) })

                })
                .finally(()=>promResolve)

        }

        const tryToAssignAppendix = (fullMessageFromEHealthBox, createdDocumentToAssign) => {

            const promResolve = Promise.resolve()

            return iccCryptoXApi
                .extractKeysFromDelegationsForHcpHierarchy(
                    _.trim(_.get(user,"healthcarePartyId","")),
                    _.trim(_.get(createdDocumentToAssign,"id","")),
                    _.size(_.get(createdDocumentToAssign,"encryptionKeys",{})) ? createdDocumentToAssign.encryptionKeys : _.get(createdDocumentToAssign,"delegations",{})
                )
                .then(({extractedKeys: encryptionKeys}) => beResultApi.getInfos(createdDocumentToAssign.id, false, null, encryptionKeys.join(',')).catch(e=>{console.log("ERROR with getInfos: ", e); return promResolve;}))
                .then(beResultApiDocInfos => {
                    let prom = Promise.resolve();
                    _.map(beResultApiDocInfos, docInfo => {
                        prom = prom.then(promisesCarrier => assignResult(fullMessageFromEHealthBox, docInfo, createdDocumentToAssign)
                            .then(assignResult => _.concat(promisesCarrier, {
                                assigned: !!_.trim(_.get(assignResult, "patientId", "")),
                                protocolId: _.trim(_.get(docInfo, "protocol", "")),
                                labo: _.trim(_.get(docInfo, "labo", "")),
                                contactId: _.trim(_.get(assignResult, "id", "")),
                                documentId: _.trim(_.get(createdDocumentToAssign, "id", "")),
                                docInfo: docInfo,
                                patientId: _.trim(_.get(assignResult, "patientId", ""))
                            }))
                            .catch(e => { console.log("ERROR with assignResult: ", e); return Promise.resolve(_.concat(promisesCarrier, {})); })
                        )
                    })
                    return prom.then(assignResults => assignResults)
                })
                .catch(e => {console.log("ERROR with extractKeysFromDelegationsForHcpHierarchy: ", e); return promResolve;})

        }

        const assignResult = (message,docInfo,document) => {

            const promResolve = Promise.resolve()

            const filter = _.trim(_.get(docInfo,"ssin","")).match(/[0-9]{11}/) ?
                { '$type': 'PatientByHcPartyAndSsinFilter', 'healthcarePartyId': parentHcp.id, 'ssin': _.trim(_.get(docInfo,"ssin","")) } :
                {
                    '$type': 'UnionFilter',
                    'healthcarePartyId': parentHcp.id,
                    'filters': [
                        {
                            '$type': 'IntersectionFilter',
                            'healthcarePartyId': parentHcp.id,
                            'filters': [
                                { '$type': 'PatientByHcPartyNameContainsFuzzyFilter', 'healthcarePartyId': parentHcp.id, 'searchString': _.trim(_.get(docInfo,"lastName","")) },
                                { '$type': 'PatientByHcPartyNameContainsFuzzyFilter', 'healthcarePartyId': parentHcp.id, 'searchString': _.trim(_.get(docInfo,"firstName","")) }
                            ]
                        },
                        { '$type': 'PatientByHcPartyDateOfBirthFilter', 'healthcarePartyId': parentHcp.id, 'dateOfBirth': _.trim(_.get(docInfo,"dateOfBirth","")) }
                    ]
                }

            return iccPatientXApi.filterByWithUser(user, null, null, 20, 0, null, null, {filter: filter})
                .then(({rows}) => {

                    const candidates = _.filter(rows, p => {
                        const pFn =  p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/)[0]
                        const lFn =  docInfo.firstName && docInfo.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/,'')
                        const pLn =  p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/)[0]
                        const lLn =  docInfo.lastName && docInfo.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/,'')

                        // Based on
                        // (SSIN)Exact match [OR]
                        // (Birthdate)Exact match + (FN)levenshtein<2 + (LN)levenshtein<3 [OR]
                        // (Birthdate)Exact match + (FN)Exact match [OR]
                        // (Birthdate)Exact match + (LN)Exact match [OR]
                        // (FN+LN)Exact match
                        // return (docInfo.ssin && p.ssin && docInfo.ssin === p.ssin) ||
                        //     (pFn && lFn && pLn && lLn && p.dateOfBirth && docInfo.dateOfBirth && (levenshtein(pFn,lFn) < 2 && levenshtein(pLn,lLn) < 3 && p.dateOfBirth === docInfo.dateOfBirth)) ||
                        //     (pFn && lFn && p.dateOfBirth && docInfo.dateOfBirth && (pFn === lFn && p.dateOfBirth === docInfo.dateOfBirth)) ||
                        //     (pLn && lLn && p.dateOfBirth && docInfo.dateOfBirth && (pLn === lLn && p.dateOfBirth === docInfo.dateOfBirth)) ||
                        //     (pFn && lFn && pLn && lLn && (pLn === lLn && pFn === lFn))

                        // (SSIN)Exact match (as from 20190530)
                        return (_.trim(_.get(docInfo,"ssin","something")) === _.trim(_.get(p,"ssin","else")))
                    })

                    return (_.size(candidates) !== 1) ?
                        {protocolId:_.trim(_.get(docInfo,"protocol","")), documentId:_.trim(_.get(document,"id",""))} :
                        iccContactXApi.newInstance(user, candidates[0], {
                            groupId: _.trim(_.get(message,"id","")),
                            created: +new Date,
                            modified: +new Date,
                            author: _.trim(_.get(user,"id","")),
                            responsible: _.trim(_.get(user,"healthcarePartyId","")),
                            openingDate: moment((parseInt(_.get(docInfo,"demandDate",0))?_.parseInt(_.get(docInfo,"demandDate",0)):null)).format('YYYYMMDDHHmmss')||'',
                            closingDate: moment().format('YYYYMMDDHHmmss')||'',
                            encounterType: { type: _.trim(_.get(docInfo,"codes[0].type","")), version: _.trim(_.get(docInfo,"codes[0].version","")), code: _.trim(_.get(docInfo,"codes[0].code","")) },
                            descr: "Analyse: " + _.trim(_.get(docInfo,"labo","")),
                            tags: [{type: 'CD-TRANSACTION', code: 'labresult'}],
                            subContacts: []
                        })
                            .then(contactInstance => {
                                contactInstance.services.push({
                                    id: iccCryptoXApi.randomUuid(),
                                    label: 'labResult',
                                    valueDate: parseInt(moment().format('YYYYMMDDHHmmss')),
                                    content: _.fromPairs([[language, {stringValue: _.trim(_.get(docInfo,"labo",""))}]]),
                                    tags: [{type: 'CD-TRANSACTION', code: 'labresult'}]
                                })
                                return iccContactXApi.createContactWithUser(user, contactInstance)
                            })
                            .then(createdContact => iccFormXApi.newInstance(user, candidates[0],{ contactId: _.trim(_.get(createdContact,"id","")), descr: "Lab result " + +new Date })
                                .then(formInstance => iccFormXApi.createForm(formInstance)
                                    .then(createdForm => iccCryptoXApi.extractKeysFromDelegationsForHcpHierarchy( _.trim(_.get(user,"healthcarePartyId","")), _.trim(_.get(document,"id","")), _.size(_.get(document,"encryptionKeys",{})) ? _.get(document,"encryptionKeys",{}): _.get(document,"delegations",{}))
                                        .then(({extractedKeys: enckeys}) => beResultApi.doImport(_.trim(_.get(document,"id","")), _.trim(_.get(user,"healthcarePartyId","")), language, _.trim(_.get(docInfo,"protocol","")), _.trim(_.get(createdForm,"id","")), null, enckeys.join(','), createdContact).catch(e=>{console.log("ERROR with doImport: ", e); return promResolve;}))
                                        .catch(e=>{console.log("ERROR with extractKeysFromDelegationsForHcpHierarchy: ", e); return promResolve;})
                                    )
                                    .catch(e=>{console.log("ERROR with createForm: ", e); return promResolve;})
                                )
                                .catch(e=>{console.log("ERROR with form newInstance: ", e); return promResolve;})
                            )
                            .then(createdContact => { return {id: _.trim(_.get(createdContact,"id","")), protocolId: _.trim(_.get(docInfo,"protocol","")), documentId:_.trim(_.get(document,"id","")), patientId:_.trim(_.get(candidates,"[0].id",""))}; })
                            .catch(e => { console.log("ERROR with new contact: ",e); return {protocolId:_.trim(_.get(docInfo,"protocol","")), documentId:_.trim(_.get(document,"id",""))}; })

                })
                .catch(e=>{ console.log("ERROR with filterByWithUser", e); return promResolve; })

        }

        const encryptContent = ( user, resourceObject, contentToEncrypt ) => {

            const userHpcId = _.trim(_.get(user,"healthcarePartyId",""))

            if(
                !_.trim(userHpcId) ||
                !_.trim(resourceObject) ||
                !_.trim(contentToEncrypt) ||
                typeof iccCryptoXApi.AES.encrypt !== "function"
            ) return Promise.resolve(contentToEncrypt);

            return (!!_.size(_.get(resourceObject,"encryptionKeys",{})) ? Promise.resolve(resourceObject) : iccDocumentXApi.initEncryptionKeys(user, resourceObject))
                .then(doc => iccCryptoXApi.extractKeysFromDelegationsForHcpHierarchy(userHpcId, _.trim(_.get(doc,"id","")), _.get(doc,"encryptionKeys",{})))
                .then((sfks) => iccCryptoXApi.AES.importKey("raw", iccUtils.hex2ua(sfks.extractedKeys[0].replace(/-/g, ""))))
                .then((key) => iccCryptoXApi.AES.encrypt(key, iccUtils.ua2ArrayBuffer(iccUtils.text2ua(JSON.stringify(contentToEncrypt)))))
                .catch((e) =>
                    iccCryptoXApi.decryptAndImportAesHcPartyKeysInDelegations(userHpcId, ( !!_.size(_.get(resourceObject,"encryptionKeys",{})) ? _.get(resourceObject,"encryptionKeys",{}) : _.get(resourceObject,"delegations ",{}) ) )
                        .then(decryptedAndImportedAesHcPartyKeys => iccCryptoXApi.AES.encrypt(_.get(_.head(decryptedAndImportedAesHcPartyKeys), "key", undefined), iccUtils.ua2ArrayBuffer(iccUtils.text2ua(JSON.stringify(contentToEncrypt)))))
                )

        }

        const convertFromOldToNewSystemAndCarryOn = (boxId, fullMessageFromEHealthBox, foundExistingMessage) => {

            const promResolve = Promise.resolve()

            return !_.trim(_.get(foundExistingMessage,"id","")) ?

                // Message doesn't exist yet
                registerNewMessage(fullMessageFromEHealthBox, boxId)
                    .then( ([createdMessage, createdDocuments]) => tryToAssignAppendices(createdMessage||{}, fullMessageFromEHealthBox, createdDocuments||[], boxId) )
                    .then(() => totalNewMessages[boxId]++ ) :

                // Auto-clean on EH BOX after six month
                !!(parseInt(_.get(foundExistingMessage, "created", Date.now())) < (Date.now() - (180 * 24 * 3600000))) ? removeMsgFromEhboxServer(foundExistingMessage) :

                promResolve.then(()=>{

                    const userHpcId = _.trim(_.get(user,"healthcarePartyId",""))
                    const receivedDate = parseInt(_.get(foundExistingMessage,"received",0))
                    const isAlreadyHidden = !!(_.get(foundExistingMessage,"status",0)&(1<<14))
                    const isAlreadyProcessed = !!(_.get(foundExistingMessage,"status",0)&(1<<26))
                    const sourceBox = _.trim(_.get(_.trim(_.get(foundExistingMessage,"transportGuid","")).split(':'), "[0]", ""))

                    return iccDocumentXApi.findByMessage(userHpcId, foundExistingMessage).catch(e=>{console.log("ERROR with findByMessage: ", e); return promResolve;})
                        .then(documentsOfMessage => !_.size(documentsOfMessage) ?
                            promResolve :
                            Promise.all(_.compact(_.filter(documentsOfMessage,d=>!!_.trim(_.get(d,"attachmentId",""))&&!!_.trim(_.get(d,"secretForeignKeys","")))).map(singleDocument => iccCryptoXApi.extractKeysFromDelegationsForHcpHierarchy(userHpcId, _.trim(_.get(singleDocument,"id","")), _.size(_.get(singleDocument,"encryptionKeys",[])) ? _.get(singleDocument,"encryptionKeys",[]) : _.get(singleDocument,"delegations",[]))
                                .then(({extractedKeys: enckeys}) => beResultApi.canHandle(_.trim(_.get(singleDocument,"id","")), enckeys.join(',')).then(canHandle=>!!canHandle).catch(e=>{console.log("ERROR with canHandle: ", e); return Promise.resolve(false);}))
                                .then(canHandle=>([singleDocument,!!canHandle]))
                            ))
                        )
                        .then(documentsAndCanHandleResults => {

                            const newSystemProdCommitDate = 1560231000000 // 20190611 @ 7.30 AM
                            const atLeastOneLabResult = !!_.size(_.filter(documentsAndCanHandleResults, i => !!i[1]))

                            return !!(boxId !== "INBOX" || sourceBox !== "INBOX" || !atLeastOneLabResult || !!isAlreadyHidden || !!isAlreadyProcessed || !(receivedDate < newSystemProdCommitDate )) ?
                                promResolve :
                                msgApi.deleteMessages(_.trim(_.get(foundExistingMessage,"id",""))).then(()=>{
                                    _.map(documentsAndCanHandleResults, documentAndCanHandleResult => docApi.deleteDocument(_.trim(_.get(documentAndCanHandleResult,"[0].id",""))).catch(e=>console.log("ERROR with deleteDocument", e)))
                                    return registerNewMessage(fullMessageFromEHealthBox, boxId)
                                        .then( ([createdMessage, createdDocuments]) => tryToAssignAppendices(createdMessage||{}, fullMessageFromEHealthBox, createdDocuments||[], boxId) )
                                        .then(() => totalNewMessages[boxId]++ )

                                })

                        })

                })

        }



        icureApi.getVersion()
        .then(icureVersion => appVersions.backend = _.trim(icureVersion))
        .then(() => fetch("http://127.0.0.1:16042/ok", {method:"GET"}).then(() => true).catch(() => false))
        .then(isElectron => appVersions.isElectron = !!isElectron)
        .then(() => fetch("http://127.0.0.1:16042/getVersion", {method:"GET"}).then((response) => response.json()).catch(() => false))
        .then(electronVersion => appVersions.electron = _.trim(_.get(electronVersion,"version","-")))
        .finally(()=>{

            let promisesCarrier = []
            let prom = Promise.resolve()
            _.map((boxIds||[]), singleBoxId => ehboxApi.loadMessagesUsingPOST(keystoreId, tokenId, ehpassword, singleBoxId, 200, alternateKeystores).then(messagesFromEHealthBox => {
                _.map(_.filter(messagesFromEHealthBox, m => !!_.trim(_.get(m, "id",""))), singleMessage => prom = prom
                    .then(promisesCarrier => createDbMessageWithAppendicesAndTryToAssign(singleMessage, singleBoxId).then(x=>x))
                    .catch((e) => console.log("ERROR with createDbMessageWithAppendicesAndTryToAssign: ", e))
                    .finally(()=> _.concat(promisesCarrier, []))
                )
                prom.then(()=> {

                    if(singleBoxId === "INBOX" && parseInt(totalNewMessages["INBOX"])) {
                        postMessage({totalNewMessages: parseInt(totalNewMessages["INBOX"])});
                        setTimeout(()=>{totalNewMessages["INBOX"] = 0; },100)
                    }

                    if(singleBoxId === "SENTBOX" && parseInt(totalNewMessages["SENTBOX"])) {
                        postMessage({forceRefresh: true});
                        setTimeout(()=>{totalNewMessages["SENTBOX"] = 0; },100)
                    }

                })
            }))

        })



    }
};