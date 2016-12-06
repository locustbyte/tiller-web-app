
angular.module('tillerWebApp')

    .directive("d3FloatingCirclesBackground", function () {
        return {
            restrict: "E",
            template: '<div class="circle-bg"></div>',
            link: function (scope, elem, attr, ctrl) {

                // Initial Settings
                // --------------------------------------------------------

                var colours = ['#2e2d2d', '#3d3b3b', '#1d1a1a'],
                    strokeWidth = 1,
                    lockFps = true,
                    fps = 30;

                var width = document.body.parentNode.clientWidth,
                    height = document.body.parentNode.clientHeight,
                    count = Math.floor(width / 100),
                    maxSize = Math.floor(width / 30),
                    minSize = Math.floor(width / 150),
                    randNormal = d3.random.normal(0.01, 0.2),
                    randNormal2 = d3.random.normal(0.03, 0.15),
                    mousePos = {x:-1000,y:-1000},
                    lastFrame = Date.now(),
                    frameInterval = 1000/fps,
                    frameDelta, currentFrame;

                // Helper methods
                // --------------------------------------------------------

                function onResizeWindow() {

                    width = document.body.parentNode.clientWidth;
                    height = document.body.parentNode.clientHeight;

                }

                function onMouseMove() {
                    
                    mousePos = {
                        x: d3.event.clientX,
                        y: d3.event.clientY
                    };

                }

                function calcForce(node){

                    // distance past which the force is zero
                    var maxDistance = 200;

                    var posRelativeToMouse = {
                        x: node.x - mousePos.x,
                        y: node.y - mousePos.y
                    };

                    var distance = Math.sqrt(
                        posRelativeToMouse.x * posRelativeToMouse.x +
                        posRelativeToMouse.y * posRelativeToMouse.y
                    );

                    forceDirection = {
                        x: posRelativeToMouse.x / distance,
                        y: posRelativeToMouse.y / distance,
                    };

                    // convert (0...maxDistance) range into a (1...0).
                    // Close is near 1, far is near 0
                    force = (maxDistance - distance) / maxDistance;

                    // if we went below zero, set it to zero.
                    if (force < 0) force = 0;

                    return {
                        direction: forceDirection,
                        strength: force
                    };

                }

                function render() {

                    // iterate over nodes and calculate force

                    data.map(function(node){

                        var force = calcForce(node);

                        node.forceVector = [
                            force.direction.x * force.strength * 4,
                            force.direction.y * force.strength * 4
                        ];

                    });

                    // Update the node positions

                    circles
                        .attr("cx", function(d) {

                            d.x += d.vector[0] + d.forceVector[0];

                            // test left bounds
                            if(d.x < -d.r) {
                                d.x = width + d.r;
                            
                            // test right bounds
                            } else if(d.x > width + d.r) {
                                d.x = -d.r;
                            }
                            return d.x; 
                        })
                        .attr("cy", function(d) {

                            d.y += d.vector[1] + d.forceVector[1];

                            // test top bounds
                            if(d.y < -d.r) {
                                d.y = height + d.r;

                            // test bottom bounds
                            } else if(d.y > height + d.r) {
                                d.y = -d.r;
                            }
                            return d.y; 
                        });

                };

                function renderAtFPS() {

                    // calculate delta between frames and whether we should update

                    currentFrame = Date.now();
                    frameDelta = currentFrame - lastFrame;

                    if (frameDelta > frameInterval) {

                        lastFrame = currentFrame - (frameDelta % frameInterval);

                        render();

                    }

                }

                // Initialize directive
                // --------------------------------------------------------

                // bind event listeners

                window.addEventListener('resize', onResizeWindow);
                d3.select('body').on("mousemove", onMouseMove);

                // generate nodes

                var data = d3.range(count).map(function(d, i) { 
                    return {
                        x: Math.random() * width, 
                        y: Math.random() * height,
                        r: Math.sqrt(Math.random() * width) + minSize,
                        colour: colours[Math.floor(Math.random() * 3)],
                        vector: [
                            i%2 ? -randNormal() : randNormal(),
                            -randNormal2()
                        ],
                        forceVector: [0,0]
                    }; 
                })

                // create svg

                var svg = d3.select('.circle-bg').append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%');

                // create circles

                var circles = svg.selectAll("circle")
                    .data(data)
                    .enter().append('circle')
                    .style('fill', 'transparent')
                    .style('stroke', function(d) { return d.colour; })
                    .style('stroke-width', strokeWidth)
                    .attr('cy', function(d) { return d.y; })
                    .attr('cx', function(d) { return d.x; })
                    .attr('r', function(d) { return d.r; });

                // finally, start timer...

                var timerFn = lockFps ? renderAtFPS : render;

                d3.timer(timerFn);

            }
        };
    })