# srweb.plot

Javascript plotting library inspired by matplotlib. Transfer your knowledge of matplotlib to the web and make rich interactive dynamic plots.

# Matplotlib inspired

If you know how to plot with matplotlib, it would be easy to start with this library.

Here is how you can make a simple plot:

```javascript
var plt = srweb.plot; // just to make it short

// generating some data
var t = d3.range(0.0, 2.0, 0.01);
var s = t.map( v => {
	1 + Math.sin(2*Math.pi*v);
});

plt.plot(t, s);
plt.xlabel('time (s)');
plt.ylabel('voltage (mV)');
plt.title('About as simple as it gets, folks');
plt.grid(true);
plt.show("#chart"); // defines container for figure rendering
```

If you compare the code above with [this](https://matplotlib.org/examples/pylab_examples/simple_plot.html) example from matplotlib, you will see that the code is almost the same.

But here you can do much more. You can update plot parameters and data on the fly, for example when user clicks on the plot itself:

```javascript
var p = plt.plot(t, s);
var fig = plt.show("#chart"); //shows the plot

fig.on("click", () => {
	// change x axis from time to 1/time
	p.set_xlabel("Inverse time (1/s)");
	p.x = p.x.map( v => { return 1/v; });
});
```