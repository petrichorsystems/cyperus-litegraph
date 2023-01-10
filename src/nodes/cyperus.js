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


// dsp/generator/sawtooth
class CyperusDspSawtoothNode extends CyperusNode {
  type = 'dsp/generator/sawtooth';
  title = 'sawtooth';
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
}

// audio/oscillator/sine
class sine extends CyperusNode {
    type = 'audio/oscillator/sine';
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
}

// dsp/generator/square
class CyperusDspSquareNode extends CyperusNode {
  type = 'dsp/generator/square';
  title = 'square';
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
}

// dsp/generator/triangle
class CyperusDspTriangleNode extends CyperusNode {
  type = 'dsp/generator/triangle';
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
}

// audio/delay/simple
class simple extends CyperusNode {
  type = 'audio/delay/simple';
  title = 'delay simple';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
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
}

// motion/envelope/follower
class follower extends CyperusNode {
  type = 'motion/envelope/follower';
  title = 'env_follower';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "attack",
	      param_type: "text",
	      param: this.properties.frequency
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

// dsp/processor/filter_bandpass
class CyperusDspFilterBandpassNode extends CyperusNode {
  type = 'dsp/processor/filter_bandpass';
  title = 'filter_bandpass';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
            this.properties['module_parameters'] = [
	  {
	      param_name: "amplitude",
	      param_type: "text",
	      param: this.properties.frequency
	  },
	  {
	      param_name: "cutoff",
	      param_type: "text",
	      param: this.properties.amplitude		    
	  },
	  {
	      param_name: "q",
	      param_type: "text",
	      param: this.properties.amplitude		    
	  }
      ];
    this.onExecute = () => {
    }
  }
}

// dsp/processor/filter_highpass
class CyperusDspFilterHighpassNode extends CyperusNode {
  type = 'dsp/processor/filter_highpass';
  title = 'filter_highpass';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "amplitude",
	      param_type: "text",
	      param: this.properties.frequency
	  },
	  {
	      param_name: "cutoff",
	      param_type: "text",
	      param: this.properties.amplitude		    
	  }
      ]
      this.onExecute = () => {
      }
  }
}

// dsp/processor/filter_varslope_lowpass
class CyperusDspFilterVarslopeLowpassNode extends CyperusNode {
  type = 'dsp/processor/filter_varslope_lowpass';
  title = 'filter_varslope_lowpass';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "amplitude",
	      param_type: "text",
	      param: this.properties.frequency
	  },
	  {
	      param_name: "slope",
	      param_type: "text",
	      param: this.properties.frequency
	  },
	  {
	      param_name: "cutoff_freq",
	      param_type: "text",
	      param: this.properties.amplitude		    
	  }
      ]
      this.onExecute = () => {
    }
  }
}

// network/osc/transmit
class CyperusNetworkOscTransmitNode extends CyperusNode {
  type = 'network/osc/transmit';
  title = 'osc transmitter';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "host",
	      param_type: "text",
	      param: this.properties.host
	  },
	  {
	      param_name: "port",
	      param_type: "text",
	      param: this.properties.port
	  },
	  {
	      param_name: "path",
	      param_type: "text",
	      param: this.properties.path	    
	  },
	  {
	      param_name: "samplerate_divisor",
	      param_type: "text",
	      param: this.properties.samplerate_divisor
	  }
      ];
      this.onExecute = () => {
      }
  }
}

// movement/osc/metronome
class CyperusMovementOscMetronomeNode extends CyperusNode {
  type = 'movement/osc/metronome';
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

    osc_listener_callback(node) {
	node.redraw_trigger = 1;
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

// audio/analysis/transient_detector
class CyperusAudioAnalysisTransientDetectorNode extends CyperusNode {
  type = 'cyperus/audio/analysis/transient_detector';
  title = 'transient detector';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "sensitivity",
	      param_type: "text",
	      param: this.properties.sensitivity
	  },
	  {
	      param_name: "attack_ms",
	      param_type: "text",
	      param: this.properties.attack_ms
	  },
	  {
	      param_name: "decay_ms",
	      param_type: "text",
	      param: this.properties.decay_ms
	  },
	  {
	      param_name: "scale",
	      param_type: "text",
	      param: this.properties.scale
	  }
      ];
      this.onExecute = () => {
	  this.setDirtyCanvas(true, false);
      }
      this._initAnimation();
  }

    osc_listener_callback(node) {
	node.redraw_trigger = 1;
    }

    _initAnimation = function() {
	this.anim_pos = 0;
	this.anim_duration = 210;
    }
    
    _resetAnimation = function() {
	this.anim_pos = 0;
    }

    _stepAnimation = function(ctx) {
	if( this.anim_pos >= this.anim_duration ) {
	    /* do stuff */
	    return;
	}
	var step_val = 1.0 / this.anim_duration;
	var progress = step_val * this.anim_pos;

	var time_fraction = 1 - (this.anim_pos / this.anim_duration);
	
	ctx.moveTo(0, 130);
	ctx.beginPath();

	var x_pos;
	var width;
	var height;

	x_pos = 0;

	var x_coeff = 0;
	for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
	    if (time_fraction >= (7 - 4 * a) / 11) {
		x_coeff = -Math.pow((11 - 6 * a - 11 * time_fraction) / 4, 2) + Math.pow(b, 2);
		break;
	    }
	}
	x_pos = (1 - x_coeff) * this.anim_duration;
	width = 10 * 10 * x_coeff;
	
	ctx.roundRect(x_pos, 210, width, height);
	    
	ctx.fillStyle = "rgba(0, 191, 255, 1.0)";
	ctx.fill();
	
	this.anim_pos = this.anim_pos + 1;
    }
    
    onDrawForeground = function(ctx) {
	
	if (this.flags.collapsed) {
            return;
        }
	
	this._drawNodeShape(this, ctx, [0, 130, 210, 100], false, false);
	this._stepAnimation(ctx);
    }
}
    
//register in the system
LiteGraph.registerNodeType("cyperus/main/inputs", MainInputsNode );
LiteGraph.registerNodeType("cyperus/main/outputs", MainOutputsNode );
LiteGraph.registerNodeType("dsp/generator/sawtooth", CyperusDspSawtoothNode );
LiteGraph.registerNodeType("audio/oscillator/sine", sine );
LiteGraph.registerNodeType("dsp/generator/square", CyperusDspSquareNode );
LiteGraph.registerNodeType("dsp/generator/triangle", CyperusDspTriangleNode );
LiteGraph.registerNodeType("audio/delay/simple", simple );
LiteGraph.registerNodeType("motion/envelope/follower", follower );
LiteGraph.registerNodeType("dsp/processor/filter_bandpass", CyperusDspFilterBandpassNode );
LiteGraph.registerNodeType("dsp/processor/filter_highpass", CyperusDspFilterHighpassNode );
LiteGraph.registerNodeType("dsp/processor/filter_varslope_lowpass", CyperusDspFilterVarslopeLowpassNode );
LiteGraph.registerNodeType("network/osc/transmit", CyperusNetworkOscTransmitNode );
LiteGraph.registerNodeType("movement/osc/metronome", CyperusMovementOscMetronomeNode );
LiteGraph.registerNodeType("audio/analysis/transient_detector", CyperusAudioAnalysisTransientDetectorNode );
    
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
	    
