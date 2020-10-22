let Slide = function(){

    this.elems = document.querySelectorAll('#main div');
    this.gotopageButtons = document.querySelectorAll('.navigation ul li');
    this.nbElements = this.elems.length;
    this.oPageInfo = {
        page:null,
        title: null,
        url: location.href
    };

    this.getRequest = function(){
        let that = this;            
        let queryString = window.location.search;
        let searchParams = new URLSearchParams(queryString);
        let pageRequest = null;
        if(searchParams.has("request") === true){
            pageRequest = searchParams.get("request").split("/")[2];        
        }
        let page = null;
        for (var element = 0, l = that.elems.length; element < l; element++) {
            if(pageRequest === that.elems[element].getAttribute("url")){
                page = element;
            }
        };
        return page;
    };

    this.setDatas = function(element){
        let that = this;
        let titleSlide = that.elems[element].getAttribute("title");
        let urlSlide = that.elems[element].getAttribute("url");           

        that.oPageInfo.title = titreSite + " - " + titleSlide;
        that.oPageInfo.url = urlSlide;
        that.oPageInfo.page=element;

        history.pushState(that.oPageInfo, that.oPageInfo.title, that.oPageInfo.url);
    };

    this.navHistory = function(){
        let that = this;
        window.onpopstate=function (oEvent){
            if(window.history.state !== null){
                that.display(window.history.state.page); 
            }
        };
    }

    this.setElementVisibility = function(element,visible){
        if(typeof visible === "boolean" && element instanceof HTMLElement){
            if(visible === true){
                if (element.classList.contains("hidden")){
                    element.classList.remove("hidden");
                }
            }else{
                if (!element.classList.contains("hidden")){
                    element.classList.add("hidden");
                }
            }
        }
    };

    this.bindButton = function(compteur){
        let that = this;
        that.gotopageButtons.forEach(function(button){
            button.addEventListener('click', function(){
                if((button.getAttribute("class") === "prev") && (compteur !== 0)){
                    compteur--;
                } 
                if((button.getAttribute("class") === "next") && (compteur !== (that.nbElements - 1))){
                    compteur++;
                } 
                that.setDatas(compteur);                
                that.display(compteur);            	
            });
        });
    };

    this.display = function(element){
        let that = this;
        document.title = window.history.state.title;       
        that.setElementVisibility(that.gotopageButtons[0], true);
        that.setElementVisibility(that.gotopageButtons[1], true);

        for (var i = 0, l = that.nbElements; i < l; i++){
            that.setElementVisibility(that.elems[i], false);
        }
        that.setElementVisibility(that.elems[element], true);
        if(element === 0){
            that.setElementVisibility(that.gotopageButtons[0], false);
        }
        if(element === (that.nbElements - 1)){
            that.setElementVisibility(that.gotopageButtons[1], false);
        }
    };

    this.init = function(depart){
    	let that = this;
        let request = that.getRequest();

        if(request === null){     
            switch(depart){
                case depart === undefined :
                    depart = 0;
                break;
                case depart > that.nbElements : 
                    depart = that.nbElements - 1;
                break;
                default :
                    if (isNaN(depart)){
                        depart = 0;
                    }
                break;
            }
        }else{
            depart = request;
        }

        that.setDatas(depart);
        that.display(depart);
        that.bindButton(depart);
        that.navHistory();    	
    };

};


const titreSite = document.title;
const slideLuiggi = new Slide();
if(slideLuiggi !== undefined){
    window.addEventListener ? addEventListener("load", slideLuiggi.init(), false) : window.attachEvent ? attachEvent("onload", slideLuiggi.init()) : (onload = slideLuiggi.init());
}


