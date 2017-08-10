// check if other srweb modules are already there
if(!srweb){
    var srweb = {};
}

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
    function randomId(prefix="el"){
        return Math.random().toString().replace("0.",prefix);
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
    var props = ["c", "color", "marker", "ls", "linestyle"];
    var aliases = {
        "c": "color",
        "ls": "linestyle"
    }
    class Plot{
        constructor(options={}){
            this.x = [];
            this.y = [];
            this._dom = {};
            this._options = {
                marker: "",
                linestyle: "-"
            };
            this.updateOptions(options);
        }
        updateOptions(options){
            Object.keys(options).forEach( k => {
                if(k in aliases){
                    this._options[aliases[k]] = options[k];
                }else{
                    this._options[k] = options[k];
                }
            });
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
        draw_markers(xscale, yscale, clipPath){
            if(!("markers" in this._dom)){
                this._dom.markers = this._dom.ax.append("g")
                                    .attr("clip-path", "url(#"+clipPath.attr("id")+")")
                                    .attr("class", "markers");
            }
            if(this.marker == "" || this.marker == " "){
                // this._dom.line.attr("display", "none");
                return;
            }
            let markers = this._dom.markers
              .selectAll("circle")
              .data(this._data);

            markers
                .enter().append("circle")
                .attr("cx", d => {return xscale(d.x)})
                .attr("cy", d => {return yscale(d.y)})
                .attr("r", 4)
                .attr("fill", this.mfc)
                .attr("stroke", this.mec);
            markers
                .attr("cx", d => {return xscale(d.x)})
                .attr("cy", d => {return yscale(d.y)})
                .attr("r", 4)
                .attr("fill", this.mfc)
                .attr("stroke", this.mec);
            markers
                .exit().remove();
        }
        draw_line(xscale, yscale, clipPath){
            let line = d3.line()
                .x(function(d) { return xscale(d.x); })
                .y(function(d) { return yscale(d.y); });
            if(!("line" in this._dom)){
                this._dom.line = this._dom.ax.append("path")
                                    .attr("class", "line");
            }
            if(this.linestyle == "" || this.linestyle == " "){
                // this._dom.line.attr("display", "none");
                return;
            }
            this._dom.line
                  .datum(this._data)
                  .attr("fill", "none")
                  .attr("stroke", this.color)
                  .attr("d", line);

            if(this.linestyle == "--"){
                this._dom.line.attr("stroke-dasharray", "7,3");
            }
            if(this.linestyle == ":"){
                this._dom.line.attr("stroke-dasharray", "3");
            }
            if(clipPath){
                this._dom.line
                  .attr("clip-path", "url(#"+clipPath.attr("id")+")");
            }
        }
        redraw(){
            if("ax" in this._dom){
                this.show();
            }
        }
        show(ax, xscale, yscale, clipPath){
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
            if(clipPath){
                this._dom.clipPath = clipPath;
            }else{
                clipPath = this._clipPath;
            }

            this.draw_line(xscale, yscale, clipPath);
            this.draw_markers(xscale, yscale, clipPath);
            return this;
        }
        get xmin(){ return d3.min(this.x); }
        get xmax(){ return d3.max(this.x); }
        get ymin(){ return d3.min(this.y); }
        get ymax(){ return d3.max(this.y); }
        test(){
            console.log("ok");
        }
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
            return p;
        }
        get xmin(){ return d3.min(this.plots.map( p => {return p.xmin})); }
        get xmax(){ return d3.max(this.plots.map( p => {return p.xmax})); }
        get xrange(){ return this.xmax-this.xmin; }
        get ymin(){ return d3.min(this.plots.map( p => {return p.ymin})); }
        get ymax(){ return d3.max(this.plots.map( p => {return p.ymax})); }
        get yrange(){ return this.ymax-this.ymin; }
        set_xlim(xmin, xmax){
            // sets limits of the x axis
            // TODO: make possible to pass
            // [xmin, xmax] or { xmin: x1, xmax: x2 }
            // and xmin, xmax could be functions
            this._xmin = xmin;
            this._xmax = xmax;
        }
        set_ylim(ymin, ymax){
            this._ymin = ymin;
            this._ymax = ymax;
        }
        get xscale(){
            var x = d3.scaleLinear();
            var xmin = this._xmin || this.xmin;
            var xmax = this._xmax || this.xmax;
            x.domain([xmin, xmax])
             .range([this._margin.left + 23, this._dimensions[0]-this._margin.right - 23]);
            return x;
        }
        get yscale(){
            var y = d3.scaleLinear();
            var ymin = this._ymin || this.ymin;
            var ymax = this._ymax || this.ymax;
            y.domain([ymin, ymax])
             .range([this._dimensions[1]-this._margin.bottom - 23, this._margin.top + 23]);
            return y;
        }
        set xlabel(label){
            this._xlabel = label;
        }
        set ylabel(label){
            this._ylabel = label;
        }
        set title(title){
            this._title = title;
        }
        _drawAxes(){
            var width = this._dimensions[0];
            var height = this._dimensions[1];
            var margin = {
                right: 80,
                left: 50,
                top: 40,
                bottom: 30,
            }
            if(!("title" in this._dom)){
                this._dom.title = this._dom.ax.append("text").attr("class", "title");
            }
            this._dom.title.text(this._title)
                    .style("text-anchor", "middle");
            var tsize = this._dom.title.node().getBoundingClientRect();
            this._dom.title.attr("transform",
                        "translate(" + (width/2) + " ," + 
                        (margin.top+tsize.height) + ")")

            if(!("xlabel" in this._dom)){
                this._dom.xlabel = this._dom.ax.append("text");
            }
            this._dom.xlabel.text(this._xlabel)
                    .style("text-anchor", "middle");
            var xsize = this._dom.xlabel.node().getBoundingClientRect();
            this._dom.xlabel.attr("transform",
                        "translate(" + (width/2) + " ," + 
                        (height-margin.bottom-xsize.height*0.5) + ")");


            if(!("ylabel" in this._dom)){
                this._dom.ylabel = this._dom.ax.append("text");
            }
            this._dom.ylabel.text(this._ylabel)
                    .attr("transform", "rotate(-90)")
            var ysize = this._dom.ylabel.node().getBoundingClientRect();
            this._dom.ylabel.text(this._ylabel)
                    .attr("x", -height/2).attr("y", margin.left+ysize.width*1.5/2);

            this._margin = Object.assign({}, margin);
            this._margin.left += ysize.width*1.5;
            this._margin.bottom += xsize.height*1.5;
            this._margin.top += tsize.height*1.5;

            if(!("xaxis" in this._dom)){
                this._dom.xaxis = this._dom.ax.append("g");
            }

            this._dom.xaxis
                .style("font-size", "1em")
                .call(d3.axisBottom(this.xscale));

            var axsize = this._dom.xaxis.node().getBoundingClientRect();

            this._dom.xaxis
                .attr("transform", "translate(0," + (height-this._margin.bottom-axsize.height) + ")")
            this._margin.bottom += axsize.height;

            if(!("yaxis" in this._dom)){
                this._dom.yaxis = this._dom.ax.append("g");
            }

            this._dom.yaxis
                .style("font-size", "1em")
                .call(d3.axisLeft(this.yscale));

            var aysize = this._dom.yaxis.node().getBoundingClientRect();

            this._dom.yaxis
                .attr("transform", "translate(" + (this._margin.left+aysize.width) + ",0)");
            this._margin.left += aysize.width;

            this._dom.yaxis
                .call(d3.axisLeft(this.yscale));
            this._dom.xaxis
                .call(d3.axisBottom(this.xscale));

            if(!("frame" in this._dom)){
                this._dom.clipPath = this._dom.ax.append("clipPath")
                                        .attr("id", randomId());
                this._dom.frame = this._dom.ax
                                        .append("rect")
                                        .attr("class", "frame");
                this._dom.clipRect = this._dom.clipPath
                                        .append("rect");
            }
            this._dom.frame
                .attr("x", this._margin.left)
                .attr("y", this._margin.top)
                .attr("width", this._dimensions[0]-this._margin.left-this._margin.right-1)
                .attr("height", this._dimensions[1]-this._margin.top-this._margin.bottom);
            this._dom.clipRect
                .attr("x", this._margin.left)
                .attr("y", this._margin.top)
                .attr("width", this._dimensions[0]-this._margin.left-this._margin.right-1)
                .attr("height", this._dimensions[1]-this._margin.top-this._margin.bottom);
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
                // plots holder, xscale, yscale, clipping mask
                p.show(this._dom.plots, this.xscale, this.yscale, this._dom.clipPath);
            });
            return this;
        }
    }
    class Figure{
        constructor(key, options={}){
            this._dom = {};
            this._key = key;
            this._responsive = true;
            this._options = {};
            this.updateOptions(options);
            this._resize = e => this.resize(e);
            window.addEventListener("resize", this._resize);

            this.axes = [new Axes()];
            this.currentAxes = this.axes[0];
            this.getCurrentAxes = this.gca;
        }
        resize(){
            if(("svg" in this._dom) && this.responsive){
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
            return ax.plot.apply(ax, arguments);
        }
    }

    props.forEach( p => {
        Object.defineProperty(Plot.prototype, p, {
            get: function(){
                if(p in aliases){
                    p = aliases[p];
                }
                if(p in this._options){
                    return this._options[p];
                }
                return undefined;
            },
            set: function(value){
                if(p in aliases){
                    p = aliases[p];
                }
                if(p in this._options){
                    this._options[p] = value;
                }
                this.redraw(); // fix this with a reference to axes
            }
        })
    });
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
        return this.gca();
    }
    this.ylabel = function(label){
        this.gca().ylabel = label;
        return this.gca();
    }
    this.title = function(title){
        this.gca().title = title;
        return this.gca();
    }
    this.xlim = function(xmin, xmax){
        this.gca().set_xlim(xmin, xmax);
        return this.gca();
    }
    this.ylim = function(ymin, ymax){
        this.gca().set_ylim(ymin, ymax);
        return this.gca();
    }
}


