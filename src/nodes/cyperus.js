(function(global) {
    var LiteGraph = global.LiteGraph;

// main/inputs
class MainInputsNode extends LGraphNode {
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
class MainOutputsNode extends LGraphNode {
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
class CyperusDspSawtoothNode extends LGraphNode {
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

// dsp/generator/sine
class CyperusDspSineNode extends LGraphNode {
    type = 'dsp/generator/sine';
    title = 'sine';
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
class CyperusDspSquareNode extends LGraphNode {
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
class CyperusDspTriangleNode extends LGraphNode {
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

// dsp/processor/delay
class CyperusDspDelayNode extends LGraphNode {
  type = 'dsp/processor/delay';
  title = 'delay';
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

// dsp/processor/envelope_follower
class CyperusDspEnvelopeFollowerNode extends LGraphNode {
  type = 'dsp/processor/envelope_follower';
  title = 'envelope_follower';
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
class CyperusDspFilterBandpassNode extends LGraphNode {
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
class CyperusDspFilterHighpassNode extends LGraphNode {
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
class CyperusDspFilterVarslopeLowpassNode extends LGraphNode {
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
class CyperusNetworkOscTransmitNode extends LGraphNode {
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
class CyperusMovementOscMetronomeNode extends LGraphNode {
  type = 'movement/osc/metronome';
  title = 'osc metronome';
  constructor(title) {
    super(title)
      this.properties = { precision: 1, is_module: true};
      this.properties['module_parameters'] = [
	  {
	      param_name: "frequency",
	      param_type: "text",
	      param: this.properties.frequency
	  },
      ];
      this.onExecute = () => {
	  console.log("executing..\n");
      }
  }
}
    
//register in the system
LiteGraph.registerNodeType("cyperus/main/inputs", MainInputsNode );
LiteGraph.registerNodeType("cyperus/main/outputs", MainOutputsNode );
LiteGraph.registerNodeType("dsp/generator/sawtooth", CyperusDspSawtoothNode );
LiteGraph.registerNodeType("dsp/generator/sine", CyperusDspSineNode );
LiteGraph.registerNodeType("dsp/generator/square", CyperusDspSquareNode );
LiteGraph.registerNodeType("dsp/generator/triangle", CyperusDspTriangleNode );
LiteGraph.registerNodeType("dsp/processor/delay", CyperusDspDelayNode );
LiteGraph.registerNodeType("dsp/processor/envelope_follower", CyperusDspEnvelopeFollowerNode );
LiteGraph.registerNodeType("dsp/processor/filter_bandpass", CyperusDspFilterBandpassNode );
LiteGraph.registerNodeType("dsp/processor/filter_highpass", CyperusDspFilterHighpassNode );
LiteGraph.registerNodeType("dsp/processor/filter_varslope_lowpass", CyperusDspFilterVarslopeLowpassNode );

LiteGraph.registerNodeType("network/osc/transmit", CyperusNetworkOscTransmitNode );

LiteGraph.registerNodeType("movement/osc/metronome", CyperusMovementOscMetronomeNode );


    
})(this);
