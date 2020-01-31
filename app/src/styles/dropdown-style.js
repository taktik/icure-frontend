const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="dropdown-style">
    <template>
        <style is="custom-style">
            paper-dropdown-menu-light{
				--paper-dropdown-menu-focus-color: var(--app-secondary-color);
				--paper-dropdown-menu-input: {
					font-size: var(--font-size-normal);
					line-height: 22px;
					padding: 0 8px;
					background: var(--app-input-background-color);
					border-radius: 4px 4px 0 0;
                    height: 22px;
                    margin-top: -8px;
				};
				--paper-dropdown-menu-button: {
					height: 40px;
				};
				--paper-dropdown-menu-icon: {
					margin-bottom: 2px;
					color: var(--app-text-color);
					height: 18px;
					width: 18px;
				};
				--paper-listbox: {
					padding: 0;
				};

				--paper-item: {
					height: 28px;
					font-size: var(--font-size-normal);
					padding: 0 12px;
					min-height: 28px;
				};
			}
			paper-dropdown-menu{
				--paper-dropdown-menu-ripple: {
					z-index: 2;
					height: 100%;
				}
				--paper-dropdown-menu-focus-color: var(--app-secondary-color);
				--paper-input-container-focus-color: var(--app-secondary-color);
				
				--paper-dropdown-menu-button: {
					height: 40px;
				};
				
				--paper-listbox: {
					padding: 0;
				};

				--paper-item: {
					height: 28px;
					font-size: var(--font-size-normal);
					padding: 0 12px;
					min-height: 28px;
				};
				--paper-input-container: {
					padding: 0;
					height: 40px;
					width: 100%;
					box-sizing: border-box;
				};

				--paper-input-container-input: {
					height: 22px;
					font-size: var(--font-size-normal);
					line-height: var(--font-size-normal);
					padding: 4px 8px 0;
					padding-top: 4px;
					box-sizing: border-box;
					background: var(--app-input-background-color);
					border-radius: 4px 0 0 0;
				};
				--paper-input-container-label: {
					z-index: 2;
				};
                --paper-input-container-label-floating: {
                    font-size: var(--font-size-large);
                    padding: 0 12px;
                    height: 15px;
                    line-height: 11px;
                    box-sizing: border-box;
					overflow: visible;
                };

				--paper-input-container-label-focus: {
					color: var(--app-secondary-color);
				};

				--paper-input-container-underline-disabled: {
					border-bottom-color: var(--app-text-color-disabled);
				};

				--paper-input-container-disabled: {
					opacity: 1;
				};

				--paper-input-suffix: {
					background: var(--app-input-background-color);
					border-radius: 0 4px 0 0;
					height: 22px;
					line-height: 20px;
				};
				--paper-dropdown-menu-icon: {
					border-radius: 0 4px 0 0;
                    height: 22px;
                    width: 22px;
					background:  var(--app-input-background-color);
                };
			}
			iron-input>input {
				height: 100%;
			}        
		</style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
