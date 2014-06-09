# interruptible
Schedule some tasks to happen for a length of time with priority behaviours, mainly aimed at a shared view with multiple controllers.

Say what! Lets break it down a little bit. So we have some tasks which are basically just things which will in the future for some duration of time.


## API
Construct a scheduler

    var scheduler = new Interruptible({
      timestep: 100
    });

You can run/pause with

    scheduler.run();
    scheduler.pause();

You add these tasks to the scheduler and it'll run scheduling the underlying events

    scheduler.push(priority, {
      name: "descriptive-name",
      cancelSiblings: false,
      cancelLower: false,
      run: {
        fn: function(t) {},
        duration: 0
      },
      interrupt: {
        fn: function(t) {},
        duration: 0
      }
    });

Lets explain the options above

 * name - just a description for debugging
 * cancelLower - on run cancel all tasks with a lower priority first
 * cancelSiblings - on run cancel all tasks with the same or lower priority
 * run.fn - the function to run
 * run.duration - how long to run it for 
 * interrupt.fn - the function on interrupt
 * interrupt.duration - how long to run the interrupt function for 

Get a JSON representation of the current scheduled tasks, useful for visualising the tasks

    scheduler.toJSON();


## Events

 * empty - The scheduler is empty
 * added - An item has been added to the scheduler (maybe in the future)
 * running - An item has started running for the first time
 * removed - An item has finished and being removed

