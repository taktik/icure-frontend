const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
<dom-module id="vaadin-checkbox-style" theme-for="vaadin-checkbox">
    <template>
        <style>
            :host([checked]) [part="checkbox"] {
                background-color: var(--app-secondary-color) !important;
            }
        </style>
    </template>
</dom-module>
<dom-module id="vaadin-date-picker-style" theme-for="vaadin-date-picker">
    <template>
        <style include="vaadin-date-picker-default-theme shared-styles">
            :host {
                padding: 0!important;
                height: 40px;
            }
        
            :host [part="text-field"] {
                max-width: 100%;
                height: 40px;
                font-size: var(--font-size-normal);
                padding: 0;
            }

            :host [part="input-field"] {
                height: 22px;
                font-size: var(--font-size-normal);
                line-height: var(--font-size-normal);
                padding: 4px 8px 0;
                padding-top: 4px;
                box-sizing: border-box;
                background: var(--app-input-background-color);
                border-radius: 4px 4px 0 0;
            }

            :host [part=toggle-button] {
                margin-top: 0;
                padding: 4px 8px 0;
                background: var(--app-input-background-color);
                color: var(--app-text-color);
                height: 22px;
                width: 22px;
                border-radius: 0 4px 0 0;
                box-sizing: border-box;
                margin-bottom: 0;
                margin-left: 0;
                font-size: 17px;
            }

            :host [part="value"] {
                border-radius: 4px 0 0 0;
                padding-top: 2px;
                font-size: var(--font-size-normal);
            }

            :host [part=clear-button] {
                height: 22px;
                width: 22px;
                margin: 12px 0 0;
                line-height: 22px;
                border-radius: 0;
                background-color: var(--app-input-background-color);
            }

            [part="label"] {
                font-size: var(--font-size-small)!important;
            }


        </style>
    </template>
</dom-module>
<dom-module id="vaadin-date-picker-overlay-style" theme-for="vaadin-date-picker vaadin-date-picker-overlay-content vaadin-date-picker-overlay vaadin-month-calendar vaadin-button">
    <template>
        <style include="shared-styles">
            :host [part="months"] {
                --vaadin-infinite-scroller-item-height: 240px;
            }
            :host [part="toolbar"] {
                justify-content: flex-start;
            }
            :host [part="toolbar"] [part$="button"] {
                margin-right: 8px;
            }
            :host [part=cancel-button]{
                text-transform: unset!important;
                color: var(--app-secondary-color);
                font-size: var(--font-size-normal);
                padding: 0 12px;
                height: 28px;
                display: none;
            }

            :host [part=today-button] {
                text-transform: unset!important;
                border: 1px solid var(--app-secondary-color)!important;
                color: var(--app-secondary-color);
                font-size: var(--font-size-small);
                padding: 0 12px;
                height: 28px;
            }

            :host [part="date"][today]:not([selected]) {
                color: var(--app-secondary-color);
            }

            :host [part="date"][focused][selected], :host[part="date"]:active {
                color: var(--app-text-color-light)!important;
            }

            :host [part="date"][focused]::after {
                background-color: var(--app-secondary-color)!important;
                opacity: 1!important;
            }

            :host [part="date"]:active:not([disabled])::after {
                background-color: var(--app-secondary-color)!important;
            }

            [part="date"][selected]::before {
                background-color: var(--app-secondary-color)!important;
            }

            [part="date"][focused]::before {
                box-shadow: 0 0 0 2px rgba(255, 80, 0, .2)!important;
            }

            [part="years"] [part="year-number"][current] {
                color: var(--app-secondary-color)!important;
            }

            [part="month-header"] {
                font-size: var(--font-size-large)!important;
            }

            [part="date"] {
                font-size: var(--font-size-normal)!important;
            }

            [part="weekday"] {
                font-size: var(--font-size-small)!important;
            }
        </style>
    </template>
</dom-module>
<dom-module id="vaadin-text-field-style" theme-for="vaadin-date-picker vaadin-text-field vaadin-combo-box">
    <template>
        <style include="shared-styles">
            :host([has-label]) [part="label"] {
                z-index: 1;
                padding-left: 12px;
                box-sizing: border-box;
                font-size: var(--font-size-small)!important;
            }

            :host [part="text-field"] {
                width: 100%;
                min-width: 0;
                padding: 0;
                height: 40px;
            }

            [part="input-field"] {
                background: var(--app-input-background-color) !important;
                height: 22px;
                position: relative;
                padding: 0;
            }

            [part="input-field"]:after {
                width: 100%;
                opacity: 1!important;
                border-radius: 0!important;
                background-color: transparent!important;
                border-bottom: 1px solid var(--app-text-color);
                transition: none!important;
                transform-origin: 0 0;
            }

            [part="label"] {
                font-size: var(--font-size-small)!important;
            }

            :host([focused]:not([readonly])) [part="label"] {
                color: var(--app-secondary-color) !important;
            }

            :host([focused]:not([readonly])) [part="input-field"]::after {
                transform: scaleX(1)!important;
                border-bottom: 2px solid var(--app-secondary-color);
            }

            :host [part="value"] {
                padding: 0 8px;              
                min-height: 22px;
                font-size: var(--font-size-normal);
            }

            [part=clear-button], [part=toggle-button] {
                font-family: vaadin-combo-box-icons;
                margin-top: 12px;
                padding-top: 4px;
                background: var(--app-input-background-color);
                height: 20px;
                width: 20px;
                border-radius: 0 4px 0 0;
                box-sizing: border-box;
                margin-bottom: 0;
            }

            :host([has-value]) [part="value"]{
                border-radius:4px 0 0 0;
                font-size: var(--font-size-normal);
            }

        </style>
    </template>
</dom-module>
<dom-module id="vaadin-combo-box-item-style" theme-for="vaadin-combo-box-item">
    <template>
        <style include="shared-styles">
            :host [part="content"] {
                font-size: var(--font-size-normal)!important;
            }
            :host [part="content"][selected], :host [part="content"][focused] {
                color: var(--app-secondary-color)!important;
            }
            :host {
                height: 28px!important;
                max-height: 28px!important;
                min-height: 28px!important;
            }
            :host(:hover) {
                background-color:rgba(255, 80, 0, .2)!important;
            }
            :host([focused]:not([disabled])) {
                box-shadow: inset 0 0 0 1px var(--app-secondary-color)!important;
            }
            :host::before {
                color: var(--app-secondary-color)!important;
            }
        </style>
    </template>
</dom-module>
<dom-module id="invoice-grid-style" theme-for="vaadin-grid">
    <template>
        <style include="shared-styles">
            .pendingTable vaadin-grid{
                width: 100px;
            }
            [part~="cell"]:not([part~="details-cell"]) {
            }

            :host [part~="header-cell"]:not([part~="details-cell"]) {
            }

            :host(#invoiceGrid) [part~=body-cell]:not([part~="details-cell"]){
                background-color: var(--app-background-color);
            }

            :host(#invoiceGrid) [part~="footer-cell"]{
                background-color: red;
            }

            :host(#invoiceGridDetail) [part~=body-cell]:not([part~="details-cell"]){
                max-height: 48px;
                overflow-y: auto;
                align-items: flex-start;
                padding-top: 14px;
            }

            :host(#mail-list) [part~=row]:hover {
                background: var(--app-background-color-dark);
            }

            :host(#nmclGrid) [part~="cell"] {
                padding: 4px 0;
            }
            :host(#selectedMedicationTable) {
                padding: 0 !important;
                margin-top: 0 !important;
            }
            :host(#selectedMedicationTable) [part~="cell"] {
                padding: 0 4px !important;
                border-bottom: none;
            }
            :host(#selectedMedicationTable) [part~="row"] {
                border-left: 1px solid var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                border-bottom: 1px solid var(--app-background-color-dark);
            }

            #items [part~="row"] {
                z-index: -109;
            }
            :host(#selectedMedicationTable) .med-det-moment {
                border-left: 1px solid var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
            }

            :host(#selectedMedicationTable) [part~="cell"].clear-from-table {
                width: 48px;
                flex-grow: 0;
            }
            :host(#selectedMedicationTable) [part~="header-cell"] {
                background: var(--app-background-color-dark);
                min-height: 40px;
            }
            :host(#selectedMedicationTable) [part~="header-cell"]:not(:first-child) {
                text-align: center;
            }

            :host [part~=cell] {
                min-height: 28px;
                padding: 4px 8px;
                font-size: var(--font-size-normal);
            }

            :host [part=row]:only-child [part~=footer-cell], :host [part=row]:only-child [part~=header-cell] {
                min-height: 40px;
                font-size: var(--font-size-large);
            }

            :host(.sub-list) [part~=row] {
                max-height: 36px;
                min-height: 0px;
            }

        </style>
    </template>
</dom-module>
<dom-module id="vaadin-combo-box-style" theme-for="vaadin-combo-box">
    <template>
        <style include="shared-styles">
            :host {
                height: 40px;
            }
            :host(:focus) {
                outline: 0;
            }

            :host([theme~="icure-combobox"]) [part=text-field] {
                height: 40px;
                padding: 0;
                font-size: var(--font-size-normal);
                z-index: 0;
                box-sizing: border-box;
                width: 100%;
            }

            :host([theme~="icure-combobox"]) [part="value"] {
                height: 40px;
                padding: 0;
                font-size: var(--font-size-normal);
                z-index: 0;
                box-sizing: border-box;
                width: 100%;
            }

            :host [part="toggle-button"] {
                display: none;
            }

            :host(#preferredUser) [part=text-field]{
                padding: 4px 0;
            }

            [part=clear-button], [part=toggle-button] {
                font-family: vaadin-combo-box-icons;
                margin-top: 12px;
                padding-top: 4px;
                background: var(--app-input-background-color)!important;
                height: 22px;
                width: 22px;
                border-radius: 0 4px 0 0;
                box-sizing: border-box;
                margin-bottom: 0;
            }

        </style>
    </template>
</dom-module>
<dom-module id="my-text-field-styles" theme-for="vaadin-text-area">
    <template>
        <style include="shared-styles">
        :host [part="label"] {
            font-size: var(--font-size-small)!important;
        }

        :host([focused]:not([readonly])) [part="label"] {
            color: var(--app-secondary-color) !important;
        }

        :host [part="input-field"] {
            position: relative;
            font-size: var(--font-size-normal)!important;
            line-height: var(--font-size-normal)!important;
            background: var(--app-input-background-color)!important;
            border-bottom: 1px solid var(--app-text-color);
            border-radius: 4px 4px 0 0;
        }

        :host([focused]:not([readonly])) [part="input-field"] {
            border-bottom: 2px solid var(--app-secondary-color);
        }

        :host(.textarea-style) [part="value"] {
            border: none;
            font-size: 14px;
            padding: 8px;
            outline: 2px solid rgba(0,0,0,0);
            transition: outline .12s ease-in;
        }
    
        /*:host([focused].textarea-style) [part="input-field"] {
            border: 1px solid transparent;
            outline: 0;
        }*/
    
        :host([focused].textarea-style) [part="value"] {
            outline: 2px solid var(--app-primary-color);
        }
        </style>
    </template>
</dom-module>
<dom-module id="vaadin-split-layout-style" theme-for="vaadin-split-layout">
    <template>
        <style include="shared-styles">
            :host [part=splitter]{
                background-color: var(--app-background-color);
                position: relative;
                min-width: 0;
                width: 0;
                z-index: 990;
            }

            :host [part=handle]{
                opacity: 0;
                height: 100%;
                cursor: col-resize;
                left: 2px;
                max-width: 4px;
            }
            :host [part=handle]:hover,
            :host [part=handle]:active{
                opacity: 0.4;
            }
            :host [part=handle]:active {
                background: var(--app-primary-color);
            }
        </style>
    </template>
</dom-module>
<dom-module id="vaadin-grid-style" theme-for="vaadin-grid">
    <template>
        <style include="shared-styles">
            :host [part~=cell] {
                min-height: unset;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
