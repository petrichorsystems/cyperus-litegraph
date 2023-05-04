
//Creates an interface to access extra features from a graph (like play, stop, live, etc)
function Editor(container_id, options) {
    options = options || {};

    //fill container
    var html = "<div class='header'><div class='tools tools-left'></div><div class='tools tools-right'></div></div>";
    html += "<div class='content'><div class='editor-area'><canvas class='graphcanvas' width='1000' height='500' tabindex=10></canvas></div></div>";
    html += "<div class='footer'><div class='tools tools-left-bottom'></div><div class='tools tools-right'></div></div>";

    var root = document.createElement("div");
    this.root = root;
    root.className = "litegraph litegraph-editor";
    root.innerHTML = html;

    this.tools = root.querySelector(".tools");
    this.content = root.querySelector(".content");
    this.footer = root.querySelector(".footer");

    var canvas = root.querySelector(".graphcanvas");

    //create graph
    // var graph = (this.graph = new LGraph(undefined, global_cyperus));
    var graph = (this.graph = new LGraph());
    var graphcanvas = (this.graphcanvas = new LGraphCanvas(canvas, graph));
    graphcanvas.background_image = "imgs/grids.png";
    graph.onAfterExecute = function() {
        graphcanvas.draw(true);
    };
    graph.start();

	graphcanvas.onDropItem = this.onDropItem.bind(this);

    //add stuff
    this.addToolsButton("loadsession_button","load","imgs/file_open_FILL0_wght400_GRAD0_opsz48.svg", this.onLoadButton.bind(this), ".tools-left");
    this.addToolsButton("savesession_button","save","imgs/save_FILL0_wght400_GRAD0_opsz48.svg", this.onSaveButton.bind(this), ".tools-left" );
    this.addToolsButton("downloadsession_button","download","imgs/download_FILL0_wght400_GRAD0_opsz48.svg", this.onDownloadButton.bind(this), ".tools-left" );
    
    this.addLoadCounter();
    if (!options.skip_livemode) {
        this.addToolsButton(
            "livemode_button",
            "Live",
            "imgs/icon-record.png",
            this.onLiveButton.bind(this),
            ".tools-right"
        );
    }
    if (!options.skip_maximize) {
        this.addToolsButton(
            "maximize_button",
            "",
            "imgs/icon-maximize.png",
            this.onFullscreenButton.bind(this),
            ".tools-right"
        );
    }
    if (options.miniwindow) {
        this.addMiniWindow(300, 200);
    }

    //append to DOM
    var parent = document.getElementById(container_id);
    if (parent) {
        parent.appendChild(root);
    }

    graphcanvas.resize();
    //graphcanvas.draw(true,true);
}

Editor.prototype.addLoadCounter = function() {
    var meter = document.createElement("div");
    meter.className = "footerpanel loadmeter toolbar-widget";

    var html = "";
    var html =
        "<div class='cpuload'><strong>dsp</strong> <div class='bgload'><div class='fgload'></div></div></div>";

    meter.innerHTML = html;
    this.root.querySelector(".footer .tools-left-bottom").appendChild(meter);
    var self = this;

    setInterval(function() {
        meter.querySelector(".cpuload .fgload").style.width =
            2 * self.graph.execution_time * 90 + "px";
    }, 200);
};

Editor.prototype.addToolsButton = function( id, name, icon_url, callback, container ) {
    if (!container) {
        container = ".tools";
    }

    var button = this.createButton(name, icon_url, callback);
    button.id = id;
    this.root.querySelector(container).appendChild(button);
};

Editor.prototype.createButton = function(name, icon_url, callback) {
    var button = document.createElement("button");
    if (icon_url) {
        button.innerHTML = "<img width='25' height='25' src='" + icon_url + "'/> ";
    }
    button.classList.add("btn");
    button.setAttribute('title', name);
    // button.innerHTML += name;
	if(callback)
		button.addEventListener("click", callback );
    return button;
};

Editor.prototype.onLoadButton = function() {
    // var panel = this.graphcanvas.createPanel("Load session",{closable:true});
	//TO DO

    // this.root.appendChild(panel);

    var data = localStorage.getItem( "graphdemo_save" );
    if(data)
	graph.load_configure( JSON.parse( data ) );
    console.log("loaded");
};

Editor.prototype.onSaveButton = function() {
    var graph = this.graph;
    console.log("saved");
    localStorage.setItem( "graphdemo_save", JSON.stringify( graph.serialize() ) );    
};

Editor.prototype.onDownloadButton = function() {
    console.log("downloaded");

    var data = JSON.stringify( graph.serialize() );
    var file = new Blob( [ data ] );
    var url = URL.createObjectURL( file );
    var element = document.createElement("a");
    element.setAttribute('href', url);
    element.setAttribute('download', "graph.JSON" );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout( function(){ URL.revokeObjectURL( url ); }, 1000*60 ); //wait one minute to revoke url	
};

Editor.prototype.onPlayStepButton = function() {
    var graph = this.graph;
    graph.runStep(1);
    this.graphcanvas.draw(true, true);
};

Editor.prototype.onLiveButton = function() {
    var is_live_mode = !this.graphcanvas.live_mode;
    this.graphcanvas.switchLiveMode(true);
    this.graphcanvas.draw();
    var url = this.graphcanvas.live_mode
        ? "imgs/gauss_bg_medium.jpg"
        : "imgs/gauss_bg.jpg";
    var button = this.root.querySelector("#livemode_button");
    button.innerHTML = !is_live_mode
        ? "<img src='imgs/icon-record.png'/>"
        : "<img src='imgs/icon-gear.png'/>";
};

Editor.prototype.onDropItem = function(e)
{
	var that = this;
	for(var i = 0; i < e.dataTransfer.files.length; ++i)
	{
		var file = e.dataTransfer.files[i];
		var ext = LGraphCanvas.getFileExtension(file.name);
		var reader = new FileReader();
		if(ext == "json")
		{
			reader.onload = function(event) {
				var data = JSON.parse( event.target.result );
				that.graph.configure(data);
			};
			reader.readAsText(file);
		}
	}
}

Editor.prototype.goFullscreen = function() {
    if (this.root.requestFullscreen) {
        this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (this.root.mozRequestFullscreen) {
        this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (this.root.webkitRequestFullscreen) {
        this.root.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else {
        throw "Fullscreen not supported";
    }

    var self = this;
    setTimeout(function() {
        self.graphcanvas.resize();
    }, 100);
};

Editor.prototype.onFullscreenButton = function() {
    this.goFullscreen();
};

Editor.prototype.addMiniWindow = function(w, h) {
    var miniwindow = document.createElement("div");
    miniwindow.className = "litegraph miniwindow";
    miniwindow.innerHTML =
        "<canvas class='graphcanvas' width='" +
        w +
        "' height='" +
        h +
        "' tabindex=10></canvas>";
    var canvas = miniwindow.querySelector("canvas");
    var that = this;

    var graphcanvas = new LGraphCanvas( canvas, this.graph );
    graphcanvas.show_info = false;
    graphcanvas.background_image = "imgs/grids.png";
    graphcanvas.scale = 0.25;
    graphcanvas.allow_dragnodes = false;
    graphcanvas.allow_interaction = false;
    graphcanvas.render_shadows = false;
    graphcanvas.max_zoom = 0.25;
    this.miniwindow_graphcanvas = graphcanvas;
    graphcanvas.onClear = function() {
        graphcanvas.scale = 0.25;
        graphcanvas.allow_dragnodes = false;
        graphcanvas.allow_interaction = false;
    };
    graphcanvas.onRenderBackground = function(canvas, ctx) {
        ctx.strokeStyle = "#567";
        var tl = that.graphcanvas.convertOffsetToCanvas([0, 0]);
        var br = that.graphcanvas.convertOffsetToCanvas([
            that.graphcanvas.canvas.width,
            that.graphcanvas.canvas.height
        ]);
        tl = this.convertCanvasToOffset(tl);
        br = this.convertCanvasToOffset(br);
        ctx.lineWidth = 1;
        ctx.strokeRect(
            Math.floor(tl[0]) + 0.5,
            Math.floor(tl[1]) + 0.5,
            Math.floor(br[0] - tl[0]),
            Math.floor(br[1] - tl[1])
        );
    };

    miniwindow.style.position = "absolute";
    miniwindow.style.top = "4px";
    miniwindow.style.right = "4px";

    var close_button = document.createElement("div");
    close_button.className = "corner-button";
    close_button.innerHTML = "&#10060;";
    close_button.addEventListener("click", function(e) {
        graphcanvas.setGraph(null);
        miniwindow.parentNode.removeChild(miniwindow);
    });
    miniwindow.appendChild(close_button);

   this.root.querySelector(".content").appendChild(miniwindow);
};

LiteGraph.Editor = Editor;
