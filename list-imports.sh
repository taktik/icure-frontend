#!/bin/bash
echo "$1:"
egrep '<([^ ->]+-[^ >]+)[ >]' $1 | perl -pe 's/.*<([^ ->]+-[^ >]+)[ >].*/$1$2/' | sort | uniq | perl -pe 's/^(vaadin.+)/import "\@vaadin\/$1\/$1"/' | perl -pe 's/^((paper|iron|app).+)/import "\@polymer\/$1\/$1"/' | perl -pe 's/^(ht-.+)/import "$1"/'
