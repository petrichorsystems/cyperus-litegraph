
(function(global) {
    var LiteGraph = global.LiteGraph;

    var tmp_area = new Float32Array(4);

    
class CyperusNode extends LGraphNode {
        _drawNodeShape = function(
        node,
        ctx,
        size,
        selected,
        mouse_over
	) {
	    var fgcolor = node.color || node.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
            // var bgcolor = node.bgcolor || node.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
	    var bgcolor = "black";
	    
            ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 3;
	    
	    ctx.beginPath();
	    
        //bg rect
        ctx.strokeStyle = fgcolor;
        ctx.fillStyle = bgcolor;

        //render node area depending on shape
        var shape =
            node._shape || node.constructor.shape || LiteGraph.ROUND_SHAPE;

        var area = tmp_area;
        area[0] = size[0]; //x
        area[1] = size[1] + 10; //y
        area[2] = size[2] + 1; //w
        area[3] = size[3]; //h

        var old_alpha = ctx.globalAlpha;

        //full node shape
        //if(node.flags.collapsed)
        {
            ctx.beginPath();
            if (shape == LiteGraph.BOX_SHAPE) {
                ctx.fillRect(area[0], area[1], area[2], area[3]);
            } else if (
                shape == LiteGraph.ROUND_SHAPE ||
                shape == LiteGraph.CARD_SHAPE
            ) {
                ctx.roundRect(
                    area[0],
                    area[1],
                    area[2],
                    area[3],
                    this.round_radius,
                    shape == LiteGraph.CARD_SHAPE ? 0 : this.round_radius
                );
            } else if (shape == LiteGraph.CIRCLE_SHAPE) {
                ctx.arc(
                    size[0] * 0.5,
                    size[1] * 0.5,
                    size[0] * 0.5,
                    0,
                    Math.PI * 2
                );
            }
            ctx.fill();

			//separator
			if(!node.flags.collapsed)
			{
				ctx.shadowColor = "transparent";
				ctx.fillStyle = "rgba(0,0,0,0.2)";
				ctx.fillRect(0, -1, area[2], 2);
			}
        }
        ctx.shadowColor = "transparent";

        if (node.onDrawBackground) {
            node.onDrawBackground(ctx, this, this.canvas, this.graph_mouse );
        }


        //render selection marker
        if (selected) {
            if (node.onBounding) {
                node.onBounding(area);
            }


            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            if (shape == LiteGraph.BOX_SHAPE) {
                ctx.rect(
                    -6 + area[0],
                    -6 + area[1],
                    12 + area[2],
                    12 + area[3]
                );
            } else if (
                shape == LiteGraph.ROUND_SHAPE ||
                (shape == LiteGraph.CARD_SHAPE && node.flags.collapsed)
            ) {
                ctx.roundRect(
                    -6 + area[0],
                    -6 + area[1],
                    12 + area[2],
                    12 + area[3],
                    this.round_radius * 2
                );
            } else if (shape == LiteGraph.CARD_SHAPE) {
                ctx.roundRect(
                    -6 + area[0],
                    -6 + area[1],
                    12 + area[2],
                    12 + area[3],
                    this.round_radius * 2,
                    2
                );
            } else if (shape == LiteGraph.CIRCLE_SHAPE) {
                ctx.arc(
                    size[0] * 0.5,
                    size[1] * 0.5,
                    size[0] * 0.5 + 6,
                    0,
                    Math.PI * 2
                );
            }
            ctx.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR;
            ctx.stroke();
            ctx.strokeStyle = fgcolor;
            ctx.globalAlpha = 1;
        }
    };
}
    
// main/inputs
class MainInputsNode extends CyperusNode {
    type = 'cyperus/main/inputs'
    title = 'inputs'
    constructor(title) {
	super(title)

    let i = 0;
    for (let main_in of LiteGraph.global_main_ins) {
      let name = `in${i}`;
      this.addOutput(name,"number");
      i++;
    }
    this.properties = { precision: 1,
                        ids: LiteGraph.global_main_ins,
			node_type: "main_inputs"}

    this.onExecute = () => {
    }
  }
}

// main/outputs
class MainOutputsNode extends CyperusNode {
  type = 'cyperus/main/outputs'
  title = 'outputs'
  constructor(title) {
    super(title)

    let i = 0;
    for (let main_out of LiteGraph.global_main_outs) {
      let name = `out${i}`;
      this.addInput(name,"number");
      i++;
    }
    this.properties = { precision: 1,
                        ids: LiteGraph.global_main_outs,
			node_type: "main_outputs"}
    this.onExecute = () => {
    }
  }
}

// oscillator/sine
class sine extends CyperusNode {
    type = 'oscillator/sine';
    title = 'sine_oscillator';
    constructor(title) {	
	super(title);
	this.properties = { name: '', frequency: 0, amplitude: 1.0, phase: 0.0, precision: 1, is_module: true, 'module_parameters': []};
	var that = this;

	this.properties['module_parameters'] = [
		{
		    param_name: "frequency",
		    param_type: "text",
		    param: this.properties.frequency
		},
		{
		    param_name: "amplitude",
		    param_type: "text",
		    param: this.properties.amplitude		    
		},
		{
		    param_name: "phase",
		    param_type: "text",
		    param: this.properties.phase		    
		}
	];
	this.onExecute = () => {
	}
    }

    osc_listener_callback(node, response) {
        var value = response['args'];
        node.widgets[0].value = value[0]['value'].toFixed(8);
        node.widgets[1].value = value[1]['value'].toFixed(8);
        node.widgets[2].value = value[2]['value'].toFixed(8);
    }

}

// oscillator/clock
class clock extends CyperusNode {
    type = 'oscillator/clock';
    title = 'clock_oscillator';
    constructor(title) {	
	super(title);
	this.properties = { name: '', frequency: 0, amplitude: 1.0, precision: 1, is_module: true, 'module_parameters': []};
	var that = this;

	this.properties['module_parameters'] = [
		{
		    param_name: "frequency",
		    param_type: "text",
		    param: this.properties.frequency
		},
		{
		    param_name: "amplitude",
		    param_type: "text",
		    param: this.properties.amplitude		    
		}
	];
	this.onExecute = () => {
	}
    }

    osc_listener_callback(node, response) {
        var value = response['args'];
        console.log(value);
        node.widgets[0].value = value[0]['value'].toFixed(8);
        node.widgets[1].value = value[1]['value'].toFixed(8);
    }

}
    
// oscillator/triangle
class triangle extends CyperusNode {
  type = 'oscillator/triangle';
  title = 'triangle';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "frequency",
	      param_type: "text",
	      param: this.properties.frequency
	  },
	  {
	      param_name: "amplitude",
	      param_type: "text",
	      param: this.properties.amplitude		    
	  }
      ];
      this.onExecute = () => {
      }
  }

    osc_listener_callback(node, response) {
        console.log('oscillator/clock osc_triangle_callback()');        
        var value = response['args'];
        node.widgets[0].value = value[0]['value'].toFixed(8);
        node.widgets[1].value = value[1]['value'].toFixed(8);
    }    
}

// delay/simple
class simple extends CyperusNode {
  type = 'delay/simple';
  title = 'delay simple';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true, amplitude: 0.0, time: 0.0, feedback: 0.0};
      this.properties['module_parameters'] = [
	  {
	      param_name: "amplitude",
	      param_type: "text",
	      param: this.properties.amplitude
	  },
	  {
	      param_name: "time",
	      param_type: "text",
	      param: this.properties.time		    
	  },
	  {
	      param_name: "feedback",
	      param_type: "text",
	      param: this.properties.feedback
	  }
      ];
    this.onExecute = () => {
    }
  }

    osc_listener_callback(node, response) {
        var value = response['args'];
        node.widgets[0].value = value[0]['value'].toFixed(8);
        node.widgets[1].value = value[1]['value'].toFixed(8);   
        node.widgets[2].value = value[2]['value'].toFixed(8);
    }

    
}

// envelope/follower
class follower extends CyperusNode {
  type = 'envelope/follower';
  title = 'env follower';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "attack",
	      param_type: "text",
	      param: this.properties.attack
	  },
	  {
	      param_name: "decay",
	      param_type: "text",
	      param: this.properties.decay
	  },
	  {
	      param_name: "scale",
	      param_type: "text",
	      param: this.properties.scale
	  }
      ];
      this.onExecute = () => {
      }
  }
}

// filter/bandpass
class bandpass extends CyperusNode {
    type = 'filter/bandpass';
    title = 'filter bandpass';
    constructor(title) {
        super(title)
        this.properties = { precision: 1, is_module: true};
        this.properties['module_parameters'] = [
	    {
	        param_name: "cutoff_freq",
	        param_type: "text",
	        param: this.properties.time		    
	  },
	    {
	        param_name: "q",
	        param_type: "text",
	        param: this.properties.feedback
	    },
	  {
	      param_name: "amplitude",
	      param_type: "text",
	      param: this.properties.amplitude
	  }          
        ];
        this.onExecute = () => {
        }
    }
    
    osc_listener_callback(node, response) {
        var value = response['args'];
        
        node.widgets[0].value = value[0]['value'].toFixed(8);
        node.widgets[1].value = value[1]['value'].toFixed(8);
        node.widgets[2].value = value[2]['value'].toFixed(8);
        node.setDirtyCanvas(true);        
    }    
    
}

// osc/metronome
class metronome extends CyperusNode {
  type = 'osc/metronome';
  title = 'osc metronome';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "beats_per_minute",
	      param_type: "text",
	      param: this.properties.beats_per_minute
	  },
      ];
      this.onExecute = () => {
	  this.setDirtyCanvas(true, false);
      }
      this._initMetroAnimation();

  }

    osc_listener_callback(node, response) {
        console.log('osc_listener_callback()');
        console.log(response);
    }

    _initMetroAnimation = function() {
	this.anim_pos = 0;
	this.anim_duration = 300;
    }
    
    _resetMetroAnimation = function() {
	this.anim_pos = 0;
    }

    _stepMetroAnimation = function(ctx) {	
	var step_val = 1.0 / this.anim_duration;

	var color_val = step_val * this.anim_pos * 191;
	var color_val_rev = 191 - color_val;
        ctx.fillStyle = `rgba(${color_val_rev},${color_val},${color_val+64},0.5)`;
	
	this.anim_pos = this.anim_pos + 1;
    }
    
    onDrawForeground = function(ctx) {
	
	if (this.flags.collapsed) {
            return;
        }

        if (this.value == -1) {
            this.value =
                (this.properties.value - this.properties.min) /
                (this.properties.max - this.properties.min);
        }

        var center_x = this.size[0] * -1.0 *.5 + 48
        var center_y = this.size[1] * 1.0 - 45;
        var radius = Math.min(this.size[0], this.size[1]) * 1.0 - 5;
        var w = Math.floor(radius * 0.05);

        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.rotate(Math.PI * 0.75);

        //bg

        //inner
	if( this.redraw_trigger ) {
	    this._resetMetroAnimation();
	    this._stepMetroAnimation(ctx);
	    this.redraw_trigger = 0;
	} else {
	    this._stepMetroAnimation(ctx);
	}
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, Math.PI * 2.0);
        ctx.fill();

        //value
        // ctx.strokeStyle = "black";
        // ctx.fillStyle = this.properties.color;
        // ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(
            0,
            0,
            radius - 4,
            0,
            Math.PI * 1.5 * Math.max(0.01, this.value)
        );
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.restore();

	ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
        ctx.beginPath();
        ctx.arc(center_x, center_y, radius * 0.75, 0, Math.PI * 2, true);
        ctx.fill();

        //miniball
        ctx.fillStyle = this.mouseOver ? "white" : this.properties.color;
        ctx.beginPath();
        var angle = this.value * Math.PI * 1.5 + Math.PI * 0.75;
        ctx.arc(
            center_x + Math.cos(angle) * radius * 0.65,
            center_y + Math.sin(angle) * radius * 0.65,
            radius * 0.05,
            0,
            Math.PI * 2,
            true
        );
        ctx.fill();

        //text
        ctx.fillStyle = this.mouseOver ? "white" : "#AAA";
        ctx.font = Math.floor(radius * 0.250) + "px Arial";
        ctx.textAlign = "center";
	
        ctx.fillText(
            `${this.properties['beats_per_minute']}bpm`,
            center_x,
            center_y + radius * 0.10
        );
    }
}
    
// utils/float
class float extends CyperusNode {
  type = 'utils/float';
    title = 'float';
    
  constructor(title) {
      super(title)
      this.size = [64, 84];
      this.value = 0.0;
      
      this.properties = {
          min: 0,
          max: 1,
          value: 0.0,
          color: "#7AF",
          precision: 2,
          is_module: true
      }

      this.properties['module_parameters'] = [
	  {
	      param_name: "value",
	      param_type: "knob",
	      param: this.properties.value
	  },
      ];
  }

    on_configure(node) {
        console.log("cyperus.js::float::on_configure()");
        
        var value = node.properties.value;
        
        if (value < node.properties.min) {
            value = node.properties.min;
        }

        if (value > node.properties.max) {
            value = node.properties.max
        }
        node.properties.value = value;
        var node_value = (value - node.properties.min) / (node.properties.max - node.properties.min);
        node.value = node_value;
        node.setDirtyCanvas(true);

    }
    
    osc_listener_callback(node, response) {

        var value = response['args']['value'];

        if(value == node.properties.value)
            return;
        
        if (value < node.properties.min) {
            value = node.properties.min;
        }

        if (value > node.properties.max) {
            value = node.properties.max
        }
        
        node.properties.value = value;
        var node_value = (value - node.properties.min) / (node.properties.max - node.properties.min);
        node.value = node_value;
        
        node.setDirtyCanvas(true);

    }
    
    onDrawForeground = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }

        // if (this.value == -1) {
        //     this.value =
        //         (this.properties.value - this.properties.min) /
        //         (this.properties.max - this.properties.min);
        // }

        var center_x = this.size[0] * 0.5;
        var center_y = this.size[1] * 0.6;
        var radius = Math.min(this.size[0], this.size[1]) * 0.5 - 5;
        var w = Math.floor(radius * 0.05);

        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.rotate(Math.PI * 0.75);

        //bg
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, Math.PI * 1.5);
        ctx.fill();

        //value
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.properties.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(
            0,
            0,
            radius - 4,
            0,
            Math.PI * 1.5 * Math.max(0.01, this.value)
        );
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.restore();

        //inner
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(center_x, center_y, radius * 0.75, 0, Math.PI * 2, true);
        ctx.fill();

        //miniball
        ctx.fillStyle = this.mouseOver ? "white" : this.properties.color;
        ctx.beginPath();
        var angle = this.value * Math.PI * 1.5 + Math.PI * 0.75;
        ctx.arc(
            center_x + Math.cos(angle) * radius * 0.65,
            center_y + Math.sin(angle) * radius * 0.65,
            radius * 0.05,
            0,
            Math.PI * 2,
            true
        );
        ctx.fill();

        //text
        ctx.fillStyle = this.mouseOver ? "white" : "#AAA";
        ctx.font = Math.floor(radius * 0.5) + "px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            parseFloat(this.properties.value).toFixed(this.properties.precision),
            center_x,
            center_y + radius * 0.15
        );
    };

    onExecute = function() {
        this.setOutputData(0, this.properties.value);
        this.boxcolor = LiteGraph.colorToString([
            this.value,
            this.value,
            this.value
        ]);
    };

    onMouseDown = function(e) {
        this.center = [this.size[0] * 0.5, this.size[1] * 0.5 + 20];
        this.radius = this.size[0] * 0.5;
        if (
            e.canvasY - this.pos[1] < 20 ||
            LiteGraph.distance(
                [e.canvasX, e.canvasY],
                [this.pos[0] + this.center[0], this.pos[1] + this.center[1]]
            ) > this.radius
        ) {
            return false;
        }
        this.oldmouse = [e.canvasX - this.pos[0], e.canvasY - this.pos[1]];
        this.captureInput(true);
        return true;
    };

    onMouseMove = function(e) {
        if (!this.oldmouse) {
            return;
        }

        var m = [e.canvasX - this.pos[0], e.canvasY - this.pos[1]];
        
        var v = this.value;
        v -= (m[1] - this.oldmouse[1]) * 0.01;
        
        if (v > 1.0) {
            v = 1.0;
        } else if (v < 0.0) {
            v = 0.0;
        }
        this.value = v;

        var new_property_value = this.properties.min +
            (this.properties.max - this.properties.min) * this.value;

        this.properties.value = new_property_value;
        this.setProperty("value", new_property_value);
        
        this.oldmouse = m;
        this.setDirtyCanvas(true);
    };

    onMouseUp = function(e) {
        if (this.oldmouse) {
            this.oldmouse = null;
            this.captureInput(false);
        }
    };

    onPropertyChanged = function(name, value) {
        if (name == "min" || name == "max" || name == "value") {
            this.properties[name] = parseFloat(value);
            // this.value = parseFloat(value);
            return true; //block
        }
    };

}

// utils/counter
class counter extends CyperusNode {
    type = 'utils/counter';
    title = 'utils_counter';
    constructor(title) {	
	super(title);
	this.properties = {
            name: '',
            reset: 0,
            start: 0,
            step_size: 1.0,
            min: 0.0,
            max: 16.0,
            direction: 1.0,
            auto_reset: 0.0,
            precision: 1,
            is_module: true,
            'module_parameters': []};

	this.properties['module_parameters'] = [
		{
		    param_name: "reset",
		    param_type: "text",
		    param: this.properties.reset
		},            
		{
		    param_name: "start",
		    param_type: "text",
		    param: this.properties.start
		},
		{
		    param_name: "step_size",
		    param_type: "text",
		    param: this.properties.step_size 
		},
		{
		    param_name: "min",
		    param_type: "text",
		    param: this.properties.min
		},
		{
		    param_name: "max",
		    param_type: "text",
		    param: this.properties.max
		},
		{
		    param_name: "direction",
		    param_type: "text",
		    param: this.properties.direction
		},
		{
		    param_name: "auto_reset",
		    param_type: "text",
		    param: this.properties.auto_reset
		}            
	];
	this.onExecute = () => {
	}
    }

    osc_listener_callback(node, response) {
        var value = response['args'];
        console.log('utils/counter osc_listener_callbak()');
        node.widgets[0].value = value[0].toFixed(8);
        node.widgets[1].value = value[1].toFixed(8);
        node.widgets[2].value = value[2].toFixed(8);
        node.widgets[3].value = value[3].toFixed(8);
        node.widgets[4].value = value[4].toFixed(8);
        node.widgets[5].value = value[5].toFixed(8);
        node.widgets[6].value = value[6].toFixed(8);                
    }

}

// utils/equals
class equals extends CyperusNode {
    type = 'utils/equals';
    title = 'utils_equals';
    constructor(title) {	
	super(title);
	this.properties = {
            name: '',
            x: 0.0,
            y: 1.0,
            precision: 1,
            is_module: true,
            'module_parameters': []};

	this.properties['module_parameters'] = [
		{
		    param_name: "x",
		    param_type: "text",
		    param: this.properties.x
		},            
		{
		    param_name: "y",
		    param_type: "text",
		    param: this.properties.y
		}
	];
	this.onExecute = () => {
	}
    }

    osc_listener_callback(node, response) {
        var value = response['args'];
        console.log('utils/equals osc_listener_callbak()');
        node.widgets[0].value = value[0].toFixed(8);
        node.widgets[1].value = value[1].toFixed(8);
    }

}


// utils/spigot
class spigot extends CyperusNode {
    type = 'utils/spigot';
    title = 'utils_spigot';
    constructor(title) {	
	super(title);
	this.properties = {
            name: '',
            open: 0.0,
            precision: 1,
            is_module: true,
            'module_parameters': []};

	this.properties['module_parameters'] = [
		{
		    param_name: "open",
		    param_type: "text",
		    param: this.properties.open
		}
	];
	this.onExecute = () => {
	}
    }

    osc_listener_callback(node, response) {
        var value = response['args'];
        console.log('utils/spigot osc_listener_callback()');
        node.widgets[0].value = value[0].toFixed(8);
    }

}
    
//register in the system
LiteGraph.registerNodeType("cyperus/main/inputs", MainInputsNode );
LiteGraph.registerNodeType("cyperus/main/outputs", MainOutputsNode );
LiteGraph.registerNodeType("oscillator/sine", sine );
LiteGraph.registerNodeType("oscillator/triangle", triangle );
LiteGraph.registerNodeType("oscillator/clock", clock );
LiteGraph.registerNodeType("delay/simple", simple );
LiteGraph.registerNodeType("envelope/follower", follower );
LiteGraph.registerNodeType("filter/bandpass", bandpass);
LiteGraph.registerNodeType("utils/float", float);
LiteGraph.registerNodeType("utils/counter", counter);
LiteGraph.registerNodeType("utils/equals", equals);
LiteGraph.registerNodeType("utils/spigot", spigot);            
// LiteGraph.registerNodeType("osc/metronome", metronome );
    
})(this);


//scratch stuff

	// else if( this.anim_pos >= 300) {
	    // var x_coeff = Math.pow(time_fraction, 4) ;
	    // for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
	    //     if (time_fraction >= (7 - 4 * a) / 11) {
	    // 	x_coeff = -Math.pow((11 - 6 * a - 11 * time_fraction) / 4, 2) + Math.pow(b, 2);
	    // 	break;
	    //     }
	    // }
	    // x_pos = x_coeff * this.anim_duration;
	    // width = 10 * 10 * (1 - x_coeff);
	// }
	    
