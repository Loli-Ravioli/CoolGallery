const defaultOptions = {
    linkClass: '.card',

};

const explosionClassName = 'explosion';
const explosionOpenedClassName = 'explosion_Opened';
const explosionOpeningClassName = 'explosion_Opening';

const explosionSummaryClassName = 'explosionSummary';
const explosionControlsClassName = 'explosionControls';
const explosionImagesClassName = 'explosionImages';

const explosionSummaryContentClassName = 'explosionSummaryContent';
const explosionTitleClassName = 'explosionTitle';
const explosionDescriptionClassName = 'explosionDescription';
const explosionImageClassName = 'explosionImage';

const explosionCloseClassName = 'explosionClose';
const explosionNavsClassName = 'explosionNavs';

const explosionNavClassName = 'explosionNav'; 
const explosionNavPrevClassName = 'explosionNavPrev';
const explosionNavNextClassName = 'explosionNavNext';
const explosionCouterClassName = 'explosionCounter';
const explosionNavDisabledClassName = 'explosionNavDisabled';

const explosionPrevHiddenImageClassName = 'explosionImage_PrevHidden';
const explosionPrevShowingImageClassName = 'explosionImage_PrevShowing';
const explosionActiveImageClassName = 'explosionImage_Active';
const explosionNextShowingImageClassName = 'explosionImage_NextShowing';
const explosionNextHiddenImageClassName = 'explosionImage_NextHidden';


class ExplositionGallery {
    constructor(elementNode,options) {
        this.options={
            ...defaultOptions,
            ...options
        };
        this.containerNode=elementNode;
        this.linkNodes=elementNode.querySelectorAll(this.options.linkClass);


        this.minWidth=1023;
        this.minHeigh=600;
        this.padding=2*16;
        this.showingCount=4;
        this.currentIndex=0;

        this.size=this.linkNodes.length;

        this.initModal();
        this.events();

    }
    initModal(){
        this.modalContainerNode=document.createElement("div");
        this.modalContainerNode.className=explosionClassName;

        this.modalContainerNode.innerHTML=`
        <div class="${explosionSummaryClassName}">
            <div class="${explosionSummaryContentClassName}">
                <h2 class="${explosionTitleClassName}">
                    <h3 class="${explosionDescriptionClassName}">
                </div>
            </div>
            
            <div class="${explosionControlsClassName}">
            <button class="${explosionCloseClassName}"></button>
            <div class="${explosionNavsClassName}">
            <button class="${explosionNavClassName} ${explosionNavPrevClassName}"></button>
            <div class="${explosionCouterClassName}">
            1/${this.size}
            </div>   
                <button class="${explosionNavClassName} ${explosionNavNextClassName}"></button>
                
                </div>
            </div> 
            
            <div class="${explosionImagesClassName}">
                ${Array.from(this.linkNodes).map((linkNode)=>`
                <img src="${linkNode.getAttribute('href')}"
                 alt="${linkNode.dataset.title}"
                 class="${explosionImageClassName}"
                 data-title="${linkNode.dataset.title}" data-description="${linkNode.dataset.description}"
                 />
                `).join("")}
            </div>
        `;
        

        document.body.appendChild(this.modalContainerNode);
        this.explosionSummaryNode=this.modalContainerNode.querySelector(`.${explosionSummaryClassName}`);
        this.explosionImageNodes = this.modalContainerNode.querySelectorAll(`.${explosionImageClassName}`);
        this.explosionControlsNode=this.modalContainerNode.querySelector(`.${explosionControlsClassName}`);
        this.explosionNavPrevNode=this.modalContainerNode.querySelector(`.${explosionNavPrevClassName}`);
        this.explosionNavNextNode=this.modalContainerNode.querySelector(`.${explosionNavNextClassName}`);
        this.explosionCounterNode=this.modalContainerNode .querySelector(`.${explosionCouterClassName}`);
        this.explosionTitleNode=this.modalContainerNode.querySelector(`.${explosionTitleClassName}`);
        this.explosionDescriptionNode=this.modalContainerNode.querySelector(`.${explosionDescriptionClassName}`)
        this.explosionNavsNode=this.modalContainerNode.querySelector(`.${explosionNavsClassName}`);
        this.explosionSummaryContentNode= this.modalContainerNode.querySelector(`.${explosionSummaryContentClassName}`)
        this.explosionCloseNode= this.modalContainerNode.querySelector(`.${explosionCloseClassName}`)
    }
    events(){
        this.throttledResize=throttle(this.resize,200);
        window.addEventListener("resize",this.throttledResize);
        this.containerNode.addEventListener("click",this.activateGallery);
        this.explosionNavsNode.addEventListener("click",this.switchImages);
        this.explosionCloseNode.addEventListener("click",this.closeGallery);
        window.addEventListener("keyup",this.keyDown);
    }

    resize=()=>{
        if(this.modalContainerNode.classList.contains(explosionOpenedClassName)){
            this.setInitSizesToImages();
            this.setGalleryStyles();
        }
    }
//навигация и закрытие по кнопкам
    keyDown=(event)=>{

        //this.modalContainerNode.classList.contains(explosionOpenedClassName)

        switch (this.modalContainerNode.classList.contains(explosionOpenedClassName)) {
            case (event.key==="Escape" || event.key==="Esc" || event.keyCode===27):
                this.closeGallery();
                return;
            case (event.key==="ArrowLeft"):
                if(this.currentIndex<this.size-1){
                    this.currentIndex+=1;
                }
                this.switchChanges(true);
                return;
            case (event.key==="ArrowRight"):
                if(this.currentIndex>0){
                    this.currentIndex-=1;
                }
                this.switchChanges(true);
                return;
        }
    }

    closeGallery=()=>{
        this.setInitPositionsToImages();
        this.explosionImageNodes.forEach((node)=>{
            node.style.opacity=1;
        });
        this.explosionSummaryNode.style.width="0";
        this.explosionControlsNode.style.marginTop="3000px";

        fadeOut(this.modalContainerNode,()=>{
            this.modalContainerNode.classList.remove(explosionOpenedClassName);
        })
    }
    switchImages =(event)=>{
        event.preventDefault();
        const buttonNode =event.target.closest("button");
        if(!buttonNode){
            return
        }
        if(buttonNode.classList.contains(explosionNavPrevClassName) && this.currentIndex>0){
            this.currentIndex-=1;
        }
        if(buttonNode.classList.contains(explosionNavNextClassName) && this.currentIndex<this.size-1){
            this.currentIndex+=1;
        }
        this.switchChanges(true);
    }
    activateGallery = (event) =>{
        event.preventDefault();
        const linkNode=event.target.closest("a");

        let bul = (!linkNode || this.modalContainerNode.classList.contains(explosionOpenedClassName) || this.modalContainerNode.classList.contains(explosionOpeningClassName))

        if(bul){
            return;
        }
        this.currentIndex=Array.from(this.linkNodes).findIndex((itemNode)=>
            linkNode === itemNode);
        this.modalContainerNode.classList.add(explosionOpeningClassName);

        fadeIn(this.modalContainerNode,()=>{
            this.modalContainerNode.classList.remove(explosionOpeningClassName);
            this.modalContainerNode.classList.add(explosionOpenedClassName);
            this.switchChanges();
        });

        this.setInitSizesToImages();
        this.setInitPositionsToImages();
    }
    setInitSizesToImages(){
         this.linkNodes.forEach((linkNode,index)=>{
             const data=linkNode.getBoundingClientRect();
             this.explosionImageNodes[index].style.width= data.width + "px";
             this.explosionImageNodes[index].style.height= data.height + "px";
        });

    }
    setInitPositionsToImages(){
        this.linkNodes.forEach((linkNode,index)=>{
            const data=linkNode.getBoundingClientRect();
            this.setPositionStyles(
                this.explosionImageNodes[index],
                data.left,
                data.top,
            );
    });
    }
    setPositionStyles(elem,x,y){
        elem.style.transform=`translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px,0)`;
    }
    switchChanges(hasSummaryAnimation){
         this.setCurrentState();
         this.switchDisabledNav();
         this.changeCounter();
         this.changeSummary(hasSummaryAnimation);
    }
    switchDisabledNav(){
        if(this.currentIndex===0 && !this.explosionNavPrevNode.disabled){
            this.explosionNavPrevNode.disabled=true;

        }
        if(this.currentIndex > 0 && this.explosionNavPrevNode.disabled){
            this.explosionNavPrevNode.disabled=false;

        }
        if(this.currentIndex===this.size-1 && !this.explosionNavNextNode.disabled){
            this.explosionNavNextNode.disabled=true;

        }
        if(this.currentIndex < this.size-1 && this.explosionNavNextNode.disabled){
            this.explosionNavNextNode.disabled=false;

        }
    }
    setCurrentState(){
        this.explosionPrevHiddenImages=[];
        this.explosionPrevShowingImages=[];
        this.explosionActiveImages=[];
        this.explosionNextShowingImages=[];
        this.explosionNextHiddenImages=[];

        this.currentIndex
        this.showingCount

        this.explosionImageNodes.forEach((imageNode,index)=>{
            if(index + this.showingCount<this.currentIndex){
                this.explosionPrevHiddenImages.unshift(imageNode);
            }else if(index<this.currentIndex){
                this.explosionPrevShowingImages.unshift(imageNode)
            }else if(index===this.currentIndex){
                this.explosionActiveImages.push(imageNode)
            }else if(index<=this.currentIndex+ this.showingCount){
                this.explosionNextShowingImages.push(imageNode)
            }else {
                this.explosionNextHiddenImages.push(imageNode)
            }
        });
        this.setGalleryStyles();
   }
   // тут можно настроить расстояние между карточками в уже открытой модалке путём изменения множитилей и z index
   setGalleryStyles(){
        const imageWidth = this.linkNodes[0].offsetWidth;
        const imageHeight = this.linkNodes[0].offsetHeight;
        const modalWidth = Math.max(this.minWidth,window.innerWidth);
        const modalHeight = Math.max(this.minHeigh,window.innerHeight);
        // карточки скрытые
        this.explosionPrevHiddenImages.forEach((node)=>{
            this.setImageStyles(node,{
                top:-modalHeight,
                left: 0.29* modalWidth,
                opacity:0.1,
                scale: 0.4,
                zIndex:1
            })
        });
        //карточки что слева
        this.setImageStyles(this.explosionPrevShowingImages[0],{
            top:(modalHeight-imageHeight),
            left: 0.25* modalWidth,
            opacity:0.6,
            scale: 0.8,
            zIndex:4
        });
        this.setImageStyles(this.explosionPrevShowingImages[1],{
            top:0.35 * imageHeight,
            left: 0.11* modalWidth,
            opacity:0.3,
            zIndex:3,
            scale: 0.6,
        });
        this.setImageStyles(this.explosionPrevShowingImages[2],{
            top:0,
            left: 0.17* modalWidth,
            opacity:0.2,
            zIndex:2,
            scale: 0.5,
        });
        this.setImageStyles(this.explosionPrevShowingImages[3],{
            top: -0.3 * imageHeight,
            left: 0.29* modalWidth,
            opacity:0.1,
            zIndex:1,
            scale: 0.4,
        });
        // Активная карточка
        this.explosionActiveImages.forEach((node)=>{
            this.setImageStyles(node,{
                top:(modalHeight-imageHeight)/2,
                left: (modalWidth - imageWidth )/2,
                opacity:1,
                scale: 1.2,
                zIndex:5
            })
        });
        //карточки что справа
        this.setImageStyles(this.explosionNextShowingImages[0],{
            top: 0,
            left: 0.52* modalWidth,
            opacity:0.6,
            zIndex:4,
            scale: 0.75,
        });
        this.setImageStyles(this.explosionNextShowingImages[1],{
            top: 0.2 * modalHeight,
            left: 0.65* modalWidth,
            opacity:0.3,
            zIndex:3,
            scale: 0.6,
        });
        this.setImageStyles(this.explosionNextShowingImages[2],{
            top: 0.42 * modalHeight,
            left: 0.59* modalWidth,
            opacity:0.2,
            zIndex:2,
            scale: 0.5,
        });
        this.setImageStyles(this.explosionNextShowingImages[3],{
            top: 0.67 * modalHeight,
            left: 0.47* modalWidth,
            opacity:0.1,
            zIndex:1,
            scale: 0.4,
        });
        // карточки скрытые
        this.explosionNextHiddenImages.forEach((node)=>{
            this.setImageStyles(node,{
                top:modalHeight,
                left:1.53 * modalWidth,
                opacity:0.1,
                scale: 0.4,
                zIndex:1
            })
        });
        this.setControlStyles(
            this.explosionControlsNode,
            {
                marginTop:(modalHeight-imageHeight * 1.2)/2,
                height:imageHeight*1.2
            }
        );

        this.explosionSummaryNode.style.width="50%";
    }
    changeCounter(){
        this.explosionCounterNode.innerText=`${this.currentIndex+1}/${this.size}`;
    }
    changeSummary(hasAnimation){
    const content = this.explosionImageNodes[this.currentIndex].dataset;

    if(hasAnimation){
        this.explosionSummaryContentNode.style.opacity=0;
        setTimeout(()=>{
            this.explosionTitleNode.innerText=content.title;
            this.explosionDescriptionNode.innerText=content.description;

            this.explosionSummaryContentNode.style.opacity=1;
        },300);

    }else {
        this.explosionTitleNode.innerText=content.title;
        this.explosionDescriptionNode.innerText=content.description;
    }
    }

    setImageStyles(element,{top,left,opacity,zIndex,scale}){
        if(!element){
            return;
        }
        element.style.opacity=opacity;
        element.style.transform=`translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0) scale(${scale})`;
        element.style.zIndex=zIndex;
    }

    setControlStyles(element,{marginTop,height}){
        element.style.marginTop=marginTop +"px";
        element.style.height = height +"px";
    }

}

/**
 * Helpers
 */
function fadeIn(element, callback) {
    animation();

    function animation() {
        let opacity = Number(element.style.opacity);
        if (opacity < 1) {
            opacity = opacity + 0.1
            element.style.opacity = opacity;
            window.requestAnimationFrame(animation);
            return;
        }

        if (callback) {
            callback();
        }
    }
}

function fadeOut(element, callback) {
    animation();

    function animation() {
        let opacity = Number(element.style.opacity);
    
        if (opacity > 0) {
            opacity = opacity - 0.03
            element.style.opacity = opacity;
            window.requestAnimationFrame(animation);
            return;
        }

        if (callback) {
            callback();
        }
    }
}

function throttle(callback, delay = 200) {
    let isWaiting = false;
    let savedArgs = null;
    let savedThis = null;
    return function wrapper(...args) {
        if (isWaiting) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        callback.apply(this, args);

        isWaiting = true;
        setTimeout(() => {
            isWaiting = false;
            if (savedThis) {
                wrapper.apply(savedThis, savedArgs);
                savedThis = null;
                savedArgs = null;
            }
        }, delay);
    }
}


