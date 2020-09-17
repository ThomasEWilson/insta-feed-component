const template = document.createElement('template');
const clientInstagramLink = 'https://www.instagram.com/lgbtqiapowerlifting/';
template.innerHTML = `
            <style> 
            :host {
                display: inline-block;
                contain: content; /* Boom. CSS containment FTW. */
                max-width: 260px;
            }

            /* Make sure elements don't run outside containers (great for images in columns) */
            .u-max-full-width {
              max-width: 100%;
              box-sizing: border-box; }
            
            #imageSlot::slotted(*) {
              width: 100%;
              box-sizing: border-box;
            }
            a {
              text-decoration: none;
              color: black;
            }
            a:active,
            a:hover {
              outline: 0;
            }
            #caption {
                padding: 10px 3px;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                min-height: 75px;
                box-sizing: border-box;
            }
            .block {
              display: block;
            }
            </style>
            <a href="${clientInstagramLink}" target="_blank">
                <div class="block u-max-full-width">
                    <slot id="imageSlot" name="img"></slot> <!-- named slot -->
                </div>
                <div id="caption" class="u-max-full-width">
                    <slot id="captionSlot"></slot>
                </div>
            </a>
            `;
class InstaPaneComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {}

}
customElements.define('insta-pane-component', InstaPaneComponent);