// Local modules.
import Flow from './flow/flow'
import RetryableException from './flow/retryableexception'
import Decider from './flow/decider'
import Activity from './activity/activity'
import FlowContext from './flow/flowcontext'


/**
    Simple use case test.
*/
export default class FlowJS {
    constructor() {
        // can be rewritten to accept a execute function, success handler, failure handler.
        var ActivityA = new Activity("ActivityA", function (context) {
            console.log("Executing ActivityA");
            context.setState(context._states.B);
        });

        var ActivityB = new Activity("ActivityB", function (context) {
            console.log("Executing ActivityB");
            throw new RetryableException();
            context.setState(context._states.END);
        });

        var flowStates = {
            START : Symbol("START"),
            A : Symbol("A"),
            B : Symbol("B"),
            END : Symbol("END")
        }
        
        var decider = new Decider(function(context){
            switch(context.getState()) {
                case flowStates.START: return ActivityA;
                case flowStates.A: return ActivityA;
                case flowStates.B: return ActivityB;
            }
        });

        this.flow = new Flow(decider);
        this.context = new FlowContext(flowStates);
    }
    
    run() {
        this.flow.start(this.context);
    }
}