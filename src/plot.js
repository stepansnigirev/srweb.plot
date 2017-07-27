// check if other srweb modules are already there
if(!srweb){
    var srweb = {};
}

// srweb.plot = new function(){
//     class Plot{
//         constructor(g, x, y, options){
//             this.g = g; // container
//             this.x = x;
//             this.y = y;
//             this.options = options;
//             this.path = this.g.append("path");
//         }
//         get xmin(){ return d3.min(this.x); }
//         get xmax(){ return d3.max(this.x); }
//         get ymin(){ return d3.min(this.y); }
//         get ymax(){ return d3.max(this.y); }
//         show(xscale, yscale){
//             this.line = d3.line()
//                 .x(function(d) { return xscale(d.x); })
//                 .y(function(d) { return yscale(d.y); });
//             var data = this.x.map((e,i) => {return {x: this.x[i], y: this.y[i]}});
//             this.path
//                   .datum(data)
//                   .attr("fill", "none")
//                   .attr("stroke", this.options.color)
//                   .attr("stroke-linejoin", "round")
//                   .attr("stroke-linecap", "round")
//                   .attr("stroke-width", 1)
//                   .attr("d", this.line);
//             if("sharp" in this.options && this.options.sharp){
//                 this.path.attr("shape-rendering", "crispEdges");
//             }
//         }
//     }
//     class Area{
//         constructor(g, x, y0, y1, options){
//             this.g = g; // container
//             this.x = x;
//             this.y0 = y0;
//             this.y1 = y1;
//             this.options = options;
//             this.path = this.g.append("path");
//         }
//         get xmin(){ return d3.min(this.x); }
//         get xmax(){ return d3.max(this.x); }
//         get ymin(){ return d3.min([].concat(this.y0, this.y1)); }
//         get ymax(){ return d3.max([].concat(this.y0, this.y1)); }
//         show(xscale, yscale){
//             this.area = d3.area()
//                 .x(function(d) { return xscale(d.x); })
//                 .y0(function(d) { return yscale(d.y0); })
//                 .y1(function(d) { return yscale(d.y1); });
//             var data = this.x.map((e,i) => {return {x: this.x[i], y0: this.y0[i], y1: this.y1[i]}});
//             this.path
//                 .attr("fill", this.options.color)
//                 .datum(data)
//                 .attr("d", this.area);
//             if("alpha" in this.options){
//                 this.path.attr("opacity", this.options.alpha);
//             }
//             if("sharp" in this.options && this.options.sharp){
//                 this.path.attr("shape-rendering", "crispEdges");
//             }
//         }
//         update(x, y0, y1){
//             this.x = x;
//             this.y0 = y0;
//             this.y1 = y1;
//             var data = this.x.map((e,i) => {return {x: this.x[i], y0: this.y0[i], y1: this.y1[i]}});
//             this.path
//                 .datum(data)
//                 .attr("d", this.area);
//         }
//     }
//     class Image{
//         constructor(g, url, x, y, options){
//             this.g = g; // container
//             this.url = url;
//             this._x = x;
//             this._y = y;
//             this.options = Object.assign({
//                 center: [0, 0]
//             }, options);
//             this.img = this.g.append("svg:image");
//         }
//         get x(){ return this._x }
//         set x(val){ 
//             this._x = val;
//             this.img.attr("x", this.xscale(this.x) - this.options.center[0]);
//         }
//         get y(){ return this._y }
//         set y(val){ 
//             this._y = val;
//             this.img.attr("y", this.yscale(this.y) - this.options.center[1]);
//         }
//         get xmin(){ return this.x; }
//         get xmax(){ return this.x; }
//         get ymin(){ return this.y; }
//         get ymax(){ return this.y; }
//         show(xscale, yscale){
//             this.xscale = xscale;
//             this.yscale = yscale;
//             var xo = this.options.center[0];
//             var yo = this.options.center[1];
//             this.x = this.x; // meh...
//             this.y = this.y;
//             this.img
//                .attr("xlink:href",this.url);
//             if("class" in this.options){
//                 this.img.attr("class", this.options.class);
//             }
//         }
//         drag(fn){
//             this.img.call(
//                 d3.drag()
//                     .on("drag", () => {
//                         fn.call(this, {
//                             x: this.xscale.invert(d3.event.x), 
//                             y: this.yscale.invert(d3.event.y)
//                         });
//                     })
//                 );
//         }
//     }
//     class Axes{
//         constructor(svg){
//             this.svg = svg;
//             this.g = this.svg.append("g");
//             this.cursor = this.svg.append("text");
//             // thi
//                 // .class("cursor")
//                 // .text("0,0");
//             this.plots = [];
//             this.dimensions = {width: 640, height: 480};
//         }
//         plot(x, y, options={}){
//             // check color and other styles here and put into options
//             var p = new Plot(this.g, x, y, options);
//             this.plots.push(p);
//             return p;
//         }
//         fillBetween(x, y0, y1, options={}){
//             var p = new Area(this.g, x, y0, y1, options);
//             this.plots.push(p);
//             return p;
//         }
//         figimage(url, x=0, y=0, options={}){
//             var p = new Image(this.g, url, x, y, options);
//             this.plots.push(p);
//             return p;
//         }
//         get xmin(){
//             return d3.min(
//                 this.plots.map(p => {return p.xmin})
//                 );
//         }
//         get xmax(){
//             return d3.max(
//                 this.plots.map(p => {return p.xmax})
//                 );
//         }
//         get ymin(){
//             return d3.min(
//                 this.plots.map(p => {return p.ymin})
//                 );
//         }
//         get ymax(){
//             return d3.max(
//                 this.plots.map(p => {return p.ymax})
//                 );
//         }
//         get xscale(){
//             if(!this._xscale){
//                 this.set_xlim(this.xmin, this.xmax);
//             }
//             return this._xscale;
//         }
//         get yscale(){
//             if(!this._yscale){
//                 this.set_ylim(this.ymin, this.ymax);
//             }
//             return this._yscale;
//         }
//         set_xlim(xmin, xmax){
//             var x = d3.scaleLinear()
//                 .domain([xmin, xmax])
//                 .range([0, this.dimensions.width]);
//             this._xscale = x;
//         }
//         set_ylim(ymin, ymax){
//             var y = d3.scaleLinear()
//                 .domain([ymin, ymax])
//                 .range([0, this.dimensions.height]);
//             this._yscale = y;
//         }
//         get dimensions(){
//             return this._dimensions;
//         }
//         set dimensions(dimensions){
//             //refactor nicer
//             this._dimensions = dimensions;
//             if(this._xscale){
//                 this._xscale
//                     .range([0, this.dimensions.width]);
//             }
//             if(this._yscale){
//                 this.yscale
//                     .range([0, this.dimensions.height]);            
//             }
//         }
//         show(dimensions){
//             this.dimensions=dimensions;
//             this.plots.forEach(p => { p.show(this.xscale, this.yscale) });
//         }
//     }
//     class Figure{
//         constructor(selector, options={}){
//             this.selector = selector;
//             this.container = d3.select(selector);
//             this.options = options;
//             this.container.node().innerHTML="";
//             if("figsize" in options){
//                 this.dimensions = { 
//                     width:  options.figsize[0], 
//                     height: options.figsize[1],
//                 }
//             }else{
//                 this.dimensions = this.container.node().getBoundingClientRect();
//                 window.addEventListener("resize", ()=>{
//                     this.dimensions = this.container.node().getBoundingClientRect();
//                     this.resize();
//                     this.show();
//                 });
//             }
//             this.svg = this.container.append("svg")
//                 .attr("class", "srweb-plot-figure");
//             this.resize();
//             this.axes = [];
//             this.axes.push(new Axes(this.svg))
//         }
//         resize(){
//             this.svg
//                 .attr("width", this.dimensions.width)
//                 .attr("height", this.dimensions.height)
//             ;
//         }
//         show(){
//             this.axes.forEach(ax => {
//                 ax.show(this.dimensions);
//             });
//         }
//     };
//     this.figure = function(selector, options){
//         var fig = new Figure(selector, options);
//         return [fig].concat(fig.axes);
//     }
// }

srweb.plot = new function(){
    function isObject(obj) {
        return obj === Object(obj);
    }
    class Figure{
        constructor(key, options={}){
            this._key = key;
            this._options = {
                figsize: undefined,
                facecolor: undefined,
                edgecolor: undefined,
                frameon: true
            };
            this.updateOptions(options);
        }
        updateOptions(options={}){
            Object.assign(this._options, options);
        }
        get key(){
            return this._key;
        }
        close(){
            console.log("cleaning up everything");
        }
    }

    // figure management
    this.figures = {};
    this.currentFigure = undefined;

    this.gcf = function(){
        return this.currentFigure;
    }
    this.getCurrentFigure = this.gcf;

    // creates new figure or selects existing one
    this.figure = function(key, options={}){
        // if passing only options
        if((arguments.length == 1) && isObject(arguments[0])){
            options = arguments[0];
            key = undefined;
        }
        if( key === undefined ){
            let maxkey = d3.max(
                Object.keys(this.figures).map( k => { return +k; })
            );
            key = (maxkey === undefined) ? 0 : maxkey+1;
        }

        if( key in this.figures ){
            this.currentFigure = this.figures[key];
            this.currentFigure.updateOptions(options);
        }else{
            let fig = new Figure(key, options);
            this.figures[key] = fig;
            this.currentFigure = fig;
        }
        return this.currentFigure;
    }
    this.close = function(key=undefined){
        if(key == 'all'){
            Object.keys(this.figures).forEach( k => {
                this.figures[k].close();
                delete this.figures[k];
            });
            this.currentFigure = undefined;
        }else{
            if(key === undefined){
                if(this.currentFigure != undefined){
                    this.close(this.currentFigure.key);
                }
            }else{
                if(key in this.figures){
                    this.figures[key].close();
                    if(this.currentFigure == this.figures[key]){
                        this.currentFigure = undefined;
                    }
                    delete this.figures[key];
                }
            }
        }
    }
}

var plt = srweb.plot;
plt.figure();
plt.figure("a", {edgecolor: "#777"});
plt.figure({edgecolor: "#777"});
console.log(plt.figures);