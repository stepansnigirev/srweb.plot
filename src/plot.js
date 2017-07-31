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
// TODO: if container is changed

srweb.plot = new function(){
    function isObject(obj) {
        return obj === Object(obj);
    }
    function getData(){
        // possible: (y) or (y,options) or (x,y) or (x,y,options)
        // TODO: (data) or (data, options)
        let d = arguments[0];
        let x = [];
        let y = [];
        if(arguments.length > 0 && Array.isArray(arguments[1])){
            x = arguments[0];
            y = arguments[1];
        }else{
            y = arguments[0];
            x = d3.range(y.length);
        }
        let options={};
        if(isObject(arguments[arguments.length-1])){
            Object.assign(options, arguments[arguments.length-1]);
        }
        return [x, y, options];
    }
    var defaults = {
        colormap: [
            "#1f77b4",
            "#ff7f0e",
            "#2ca02c",
            "#d62728",
            "#9467bd",
            "#8c564b",
            "#e377c2",
            "#7f7f7f",
            "#bcbd22",
            "#17becf",
        ],
    }
    class Plot{
        constructor(options={}){
            this.x = [];
            this.y = [];
            this._dom = {};
            this._options = {};
            this.updateOptions(options);
            this._xscale = undefined;
            this._yscale = undefined;
        }
        updateOptions(options){
            Object.assign(this._options, options);
            this.redraw();
        }
        plot(){
            let options = {};
            [this.x, this.y, options] = getData.apply(this, arguments);
            this.updateOptions(options);
            return this;
        }
        get _data(){
            return this.x.map( (v, i) => {
                return {x: this.x[i], y:this.y[i] };
            });
        }
        get mfc(){
            let c = this._options.color;
            if("mfc" in this._options){
                c = this._options.mfc;
            }
            return c;
        }
        get mec(){
            let c = this._options.color;
            if("mec" in this._options){
                c = this._options.mec;
            }
            return c;
        }
        get color(){
            return this._options.color;
        }
        draw_markers(xscale, yscale){
            if(!("markers" in this._dom)){
                this._dom.markers = this._dom.ax.append("g")
                                    .attr("class", "markers");
            }
            let markers = this._dom.markers
              .selectAll("circle")
              .data(this._data);

            markers
                .enter().append("circle")
                .attr("cx", d => {return xscale(d.x)})
                .attr("cy", d => {return yscale(d.y)})
                .attr("r", 3.5)
                .attr("fill", this.mfc)
                .attr("stroke", this.mec);
            markers
                .attr("cx", d => {return xscale(d.x)})
                .attr("cy", d => {return yscale(d.y)})
                .attr("r", 3.5)
                .attr("fill", this.mfc)
                .attr("stroke", this.mec);
            markers
                .exit().remove();
        }
        draw_line(xscale, yscale){
            let line = d3.line()
                .x(function(d) { return xscale(d.x); })
                .y(function(d) { return yscale(d.y); });
            if(!("line" in this._dom)){
                this._dom.line = this._dom.ax.append("path")
                                    .attr("class", "line");
            }
            this._dom.line
                  .datum(this._data)
                  .attr("fill", "none")
                  .attr("stroke", this.color)
                  .attr("stroke-linejoin", "round")
                  .attr("stroke-linecap", "round")
                  .attr("stroke-width", 1)
                  .attr("d", line);
        }
        redraw(){
            if("ax" in this._dom){
                this.show();
            }
        }
        show(ax, xscale, yscale){
            if(!("ax" in this._dom)){
                this._dom.ax = ax;
            }
            if(xscale){
                this._xscale = xscale;
            }else{
                xscale = this._xscale;
            }
            if(yscale){
                this._yscale = yscale;
            }else{
                yscale = this._yscale;
            }

            this.draw_line(xscale, yscale);
            this.draw_markers(xscale, yscale);
            return this;
        }
        get xmin(){ return d3.min(this.x); }
        get xmax(){ return d3.max(this.x); }
        get ymin(){ return d3.min(this.y); }
        get ymax(){ return d3.max(this.y); }
    }
    class Axes{
        constructor(options={}){
            this._dom = {};
            this.plots = [];
            this._counter = 0;
        }
        plot(){
            let p = new Plot({color: defaults.colormap[this._counter]});
            this.plots.push(p);
            p.plot.apply(p, arguments);
            this._counter = (this._counter + 1) % defaults.colormap.length;
            return this;
        }
        get xmin(){ return d3.min(this.plots.map( p => {return p.xmin})); }
        get xmax(){ return d3.max(this.plots.map( p => {return p.xmax})); }
        get xrange(){ return this.xmax-this.xmin; }
        get ymin(){ return d3.min(this.plots.map( p => {return p.ymin})); }
        get ymax(){ return d3.max(this.plots.map( p => {return p.ymax})); }
        get yrange(){ return this.ymax-this.ymin; }
        get xscale(){
            var x = d3.scaleLinear()
                .domain([this.xmin, this.xmax])
                .range([this._margin.left + 7, this._dimensions[0]-this._margin.right - 7]);
            return x;
        }
        get yscale(){
            var y = d3.scaleLinear()
                .domain([this.ymin, this.ymax])
                .range([this._margin.top + 7, this._dimensions[1]-this._margin.bottom - 7]);
            return y;
        }
        set xlabel(label){
            this._xlabel = label;
        }
        set ylabel(label){
            this._ylabel = label;
        }
        _drawAxes(){
            var width = this._dimensions[0];
            var height = this._dimensions[1];
            var margin = {
                right: 10,
                left: 10,
                top: 10,
                bottom: 10,
            }
            if(!("xlabel" in this._dom)){
                this._dom.xlabel = this._dom.ax.append("text");
            }
            this._dom.xlabel.text(this._xlabel)
                    .attr("transform",
                        "translate(" + (width/2) + " ," + 
                        (height-margin.bottom) + ")")
                    .style("text-anchor", "middle");
            var xsize = this._dom.xlabel.node().getBoundingClientRect();

            if(!("ylabel" in this._dom)){
                this._dom.ylabel = this._dom.ax.append("text");
            }
            this._dom.ylabel.text(this._ylabel)
                    .attr("transform", "rotate(-90)")
            var ysize = this._dom.ylabel.node().getBoundingClientRect();
            this._dom.ylabel.text(this._ylabel)
                    .attr("x", -height/2).attr("y", margin.left+ysize.width/2);

            this._margin = Object.assign({}, margin);
            this._margin.left += ysize.width;
            this._margin.bottom += xsize.height;

            if(!("xaxis" in this._dom)){
                this._dom.xaxis = this._dom.ax.append("g");
            }

            this._dom.xaxis
                .call(d3.axisBottom(this.xscale));

            var axsize = this._dom.xaxis.node().getBoundingClientRect();

            this._dom.xaxis
                .attr("transform", "translate(0," + (height-this._margin.bottom-axsize.height) + ")")
            this._margin.bottom += axsize.height;

            if(!("yaxis" in this._dom)){
                this._dom.yaxis = this._dom.ax.append("g");
            }

            this._dom.yaxis
                .call(d3.axisLeft(this.yscale));

            var aysize = this._dom.yaxis.node().getBoundingClientRect();

            this._dom.yaxis
                .attr("transform", "translate(" + (this._margin.left+aysize.width) + ",0)");
            this._margin.left += aysize.width;

            this._dom.yaxis
                .call(d3.axisLeft(this.yscale));
            this._dom.xaxis
                .call(d3.axisBottom(this.xscale));

        }
        show(svg, dimensions){
            this._dimensions = dimensions;
            if(!("svg" in this._dom)){
                this._dom.svg = svg;
            }
            if(!("ax" in this._dom)){
                this._dom.ax = this._dom.svg.append("g");
                this._dom.plots = this._dom.ax.append("g");
            }
            this._drawAxes();
            this.plots.forEach( p => {
                p.show(this._dom.plots, this.xscale, this.yscale);
            });
            return this;
        }
    }
    class Figure{
        constructor(key, options={}){
            this._dom = {};
            this._key = key;
            this._responsive = true;
            this._options = {
                figsize: undefined,
                facecolor: undefined,
                edgecolor: undefined,
                frameon: true
            };
            this.updateOptions(options);
            this._resize = e => this.resize(e);
            window.addEventListener("resize", this._resize);

            this.axes = [new Axes()];
            this.currentAxes = this.axes[0];
            this.getCurrentAxes = this.gca;
        }
        resize(){
            if(
                ("svg" in this._dom) &&
                this.responsive
                ){
                this.show();
            }
        }
        updateOptions(options={}){
            Object.assign(this._options, options);
            this.redraw();
        }
        redraw(){
            if("svg" in this._dom){
                this.show();
            }
        }
        get responsive(){
            if(this.figsize === undefined){
                return true;
            }
            let r = false;
            this.figsize.forEach( v => {
                if(v.toString().indexOf("%") >= 0){
                    r = true;
                }
            });
            return r;
        }
        get key(){
            return this._key;
        }
        close(){
            window.removeEventListener("resize", this._resize);
            if("svg" in this._dom){
                this._dom.svg.remove();
            }
            delete this;
        }
        get figsize(){
            return this._options.figsize;
        }
        set figsize(size){
            this._options.figsize = size;
            this.redraw();
        }
        get realDimensions(){ // in px
            let dimensions = this.figsize;
            if(dimensions === undefined){
                dimensions = ["100%", "100%"];
            }
            let bbox = this._dom.container.node().getBoundingClientRect();
            let d = [bbox.width, bbox.height];
            dimensions = dimensions.map( (v, i) => {
                if(v.toString().indexOf("%") >= 0){
                    let vv = +v.replace("%","")/100;
                    return d[i]*vv;
                }else{
                    return v;
                }
            });
            return dimensions;
        }
        show(container){
            if(container === undefined && !("container" in this._dom)){
                throw "Argument is missing: container is not defined, don't have a place to show up";
            }
            if(container != undefined){
                this._dom.container = d3.select(container);
            }
            let dimensions = this.realDimensions
            if(!("svg" in this._dom)){
                this._dom.svg = this._dom.container.append("svg")
                    .attr("class", "srweb-plot-figure");
            }
            this._dom.svg
                .attr("width", dimensions[0])
                .attr("height", dimensions[1]);
            this.axes.forEach( ax => {
                ax.show(this._dom.svg, dimensions);
            });
            return this;
        }
        gca(){
            return this.currentAxes;
        }
        plot(){
            let ax = this.gca();
            ax.plot.apply(ax, arguments);
            return this;
        }
    }

    // figure management
    this.figures = {};
    this.currentFigure;

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
    this.close = function(key){
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

    // aliases for figure functions
    this.show = function(container){
        return this.gcf().show(container);
    }
    this.gca = function(){
        return this.gcf().gca();
    }
    this.getCurrentAxes = this.gca;

    this.plot = function(){
        if(!this.gcf()){
            this.figure();
        }
        let fig = this.gcf();
        return fig.plot.apply(fig, arguments);
    }
    this.xlabel = function(label){
        this.gca().xlabel = label;
    }
    this.ylabel = function(label){
        this.gca().ylabel = label;
    }
}


