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
  
  
  const styles = `
  :host {
      display: flex;
      flex-flow: column;
      flex: 1 1 auto;
      contain: content; /* Boom. CSS containment FTW. */
      max-width: 940px;
      // height: 500px;
  }
  insta-pane-component:hover {
    background: rgba(0,0,0,.04);
  }
  insta-pane-component {
    border-radius: 15px; 
  }
  
  .container {
      position: relative;
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 0 20px;
      box-sizing: border-box; }
    .column,
    .columns {
      width: 100%;
      float: left;
      box-sizing: border-box; }
  .container.outer {
      padding: 40px;
      border-radius: 50px;
      box-shadow: 0px 14px 30px rgba(0, 61, 106, 0.24);}
    
    /* For devices larger than 400px */
    @media (min-width: 400px) {
      .container {
        width: 85%;
        padding: 0; }
    }
    
    /* For devices larger than 550px */
    @media (min-width: 550px) {
      .container {
        width: 80%; }
      .column,
      .columns {
        margin-left: 4%; }
      .column:first-child,
      .columns:first-child {
        margin-left: 0; }
    
      .one-third.column               { width: 30.6666666667%; }
      .two-thirds.column              { width: 65.3333333333%; }  
    }
  
    .container:after,
    .row:after,
    .u-cf {
      content: "";
      display: table;
      clear: both; }
  
    /* Make element full width */
  .u-full-width {
    width: 100%;
    border-radius: 15px; 
    box-sizing: border-box; }
  
  /* Make sure elements don't run outside containers (great for images in columns) */
  .u-max-full-width {
    max-width: 100%;
    box-sizing: border-box; }
  
    /* Make element full width */
    .u-full-height {
      height: 100%;
      box-sizing: border-box; }
    
    /* Make sure elements don't run outside containers (great for images in columns) */
    .u-max-full-height {
      max-height: 100%;
      box-sizing: border-box; }
  
    .caption {
      padding: 10px 3px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      min-height: 75px;
      box-sizing: border-box;
    }
    `;
  const myHeaders = new Headers();
  myHeaders.append("Cookie", "ig_did=61F8B7B9-1F60-41B4-9927-58AC88EBCE0A; csrftoken=R5AHVS5GW6RPkPwPxVXr5qAYAmORg3bm; mid=X1G3kQAEAAGQUcyyQqHXR9k6DHHY");
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  

  class InstaFeedComponent extends HTMLElement {
  
      graphAPIRequest = {
        accountID: 17841430546279470,
        accessToken: 'IGQVJVNi1RM2ZAtb2c5VzROcVJiVGUyOHJybExqTVdNeURqcE40MG5nR0oyd0loZAXdTMzVVMlFJSXQ3REFrc05hUVI2dGR5bVVrdnpKZATRUQXNHT0Q5UjBsWTh4eFh4cG45WUg5WjhYeE1mSXhZAdVM4agZDZD'
      };
      
      srcList = []
  
      constructor() {
          super();
          this.attachShadow({mode: 'open'});
      }
  
      connectedCallback() {
          this.fetchInstagramMediaList();
      }

      fetchInstagramMediaList() {        
        const g = this.graphAPIRequest;
          fetch(`https://graph.instagram.com/${g.accountID}/media?fields=caption,id,media_type&limit=5&access_token=${g.accessToken}`, requestOptions)
            .then(response => response.json())
            .then(result => this.fetchImagesForPosts(result.data))
            .catch(error => console.log('error', error));
      }
  
      fetchImagesForPosts(postList) {
          const ids = postList.filter(data => data.media_type == 'IMAGE').slice(0, 3).map(data => {
              this.srcList.push({ caption: data.caption, id: data.id, src: ''});
              return data.id;
          });
          let promises = [];
          for (const id of ids) {
            let promise = fetch(`https://graph.instagram.com/${id}?fields=media_url&access_token=${this.graphAPIRequest.accessToken}`, requestOptions)
                            .then(response => response.json())
                            .then(result => { 
                                this.srcList.find(item => item.id == id).src = result.media_url;
                            })
                            .catch(error => console.log('error', error));
            promises.push(promise);
          }
          Promise.all(promises)
              .then(() => this.shadowRoot.innerHTML = this.html());
      }
  
      html() {
          let template = `
          <style>${styles}</style>
          <div class="outer container">
              <div class="row u-full-height u-max-full-height">`;
          for (const item of this.srcList) {
              template += `<insta-pane-component class="one-third column u-full-height u-max-full-height">
                              <img class="u-max-full-width u-full-width" slot="img" alt="instagram-post" src="${item.src}">
                              <span class="caption">${item.caption}</span>
                           </insta-pane-component>`;
          }
          let end = `
              </div>
          </div>
          `;
          template += end;
          return template;
      }
  
  }
        
  customElements.define('insta-feed-component', InstaFeedComponent);

