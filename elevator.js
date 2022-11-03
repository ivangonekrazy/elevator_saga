/*
 * - watch load factor: the full elevators are getting sent to floors
 *   where they cannot take any more passengers
 */
{
    init: function(elevators, floors) {
        // utils
        let elevatorDistancesFrom = (targetFloor) => {
            var distances = Array();

            elevators.forEach((e, i) => {
                distances.push(Math.abs(e.currentFloor - targetFloor));
            });

            return distances;
        };
        // end utils

        let closestElevator = (targetFloor) => {
            const distances = elevatorDistancesFrom(targetFloor);
            var closest = 0;

            distances.forEach((d,i) => {
                if (d < distances[closest]) closest = i;
            });

            return elevators[closest];
        };

        let idleElevators = () => {
          for (const e of elevators) {
            if (e.getPressedFloors().length == 0) return e;
          }
        };

        let onTheWayElevators = (targetFloor) => {
          for (const e of elevators) {
            if (e.getPressedFloors().includes(targetFloor)) return e;
          }
        };

        let bestElevator = (targetFloor) => {
          let idleElevator = idleElevators();
          if (idleElevator) return idleElevator;

          let onTheWayElevator = onTheWayElevators();
          if (onTheWayElevator) return onTheWayElevator;

          return closestElevator(targetFloor);
        };

        elevators.forEach((elevator, i) => {
            elevator.on("idle", function() {
                let idleFloors = floors.length / elevators.length;
                elevator.goToFloor(Math.floor(idleFloors * i));
            });

            elevator.on("floor_button_pressed", function(n) {
                elevator.goToFloor(n);
            });
        });

        floors.forEach((floor) => {
            floor.on("up_button_pressed", () => {
                let n = floor.floorNum();
                bestElevator(n).goToFloor(n);
            });
            floor.on("down_button_pressed", () => {
                let n = floor.floorNum();
                bestElevator(n).goToFloor(n);
            })
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
