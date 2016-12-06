
angular.module('tillerWebApp')

    .directive("floatingCirclesBackground", function () {
        return {
            restrict: "E",
            template: '<canvas></canvas>',
            link: function (scope, elem, attr, ctrl) {

                function  drawScreen () {

                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;

                    update();
                    testWalls();
                    //collide();  //test for circle collisons
                    render();

                }

                function update() {
                    for (var i = 0; i <balls.length; i++) {
                        ball = balls[i];
                        //add friction
                        ball.velocityx = ball.velocityx - ( ball.velocityx*friction);
                        ball.velocityy = ball.velocityy - ( ball.velocityy*friction);

                        if(typeof mousePos == 'undefined') {
                            mousePos = { x:-1000, y: -1000 };
                        }

                        var posRelativeToMouse = {
                            x: ball.x - mousePos.x,
                            y: ball.y - mousePos.y
                        };
                        var distance = Math.sqrt(
                            posRelativeToMouse.x * posRelativeToMouse.x +
                            posRelativeToMouse.y * posRelativeToMouse.y
                        );
                        var forceDirection = {
                            x: posRelativeToMouse.x / distance,
                            y: posRelativeToMouse.y / distance,
                        };

                        var maxDistance = 200;
                        var force = (maxDistance - distance) / maxDistance;
                        if (force < 0) force = 0;

                        //ball.nextx = (ball.x += ball.velocityx);
                        //ball.nexty = (ball.y += ball.velocityy);
                        ball.nextx = (ball.x += (ball.velocityx + forceDirection.x * force * 4));
                        ball.nexty = (ball.y += (ball.velocityy + forceDirection.y * force * 4));
                    }

                }

                function testWalls() {
                    var ball;
                    var testBall;

                    for (var i = 0; i <balls.length; i++) {
                        ball = balls[i];

                        /*if (ball.nextx+ball.radius > canvas.width) {
                            ball.velocityx = ball.velocityx*-1;
                            ball.nextx = canvas.width - ball.radius;

                        } else if (ball.nextx-ball.radius < 0 ) {
                            ball.velocityx = ball.velocityx*-1;
                            ball.nextx = ball.radius;

                        } else if (ball.nexty+ball.radius > canvas.height ) {
                            ball.velocityy = ball.velocityy*-1;
                            ball.nexty = canvas.height - ball.radius;

                        } else if(ball.nexty-ball.radius < 0) {
                            ball.velocityy = ball.velocityy*-1;
                            ball.nexty = ball.radius;
                        }*/

                        if (ball.nextx+ball.radius > canvas.width + borderOffset) {
                            ball.velocityx = ball.velocityx*-1;
                            ball.nextx = canvas.width - ball.radius;

                        } else if (ball.nextx-ball.radius < -borderOffset) {
                            ball.velocityx = ball.velocityx*-1;
                            ball.nextx = ball.radius;

                        } else if (ball.nexty+ball.radius > canvas.height + borderOffset) {
                            ball.velocityy = ball.velocityy*-1;
                            ball.nexty = canvas.height - ball.radius;

                        } else if(ball.nexty-ball.radius < -borderOffset) {
                            ball.velocityy = ball.velocityy*-1;
                            ball.nexty = ball.radius;
                        }

                    }

                }

                function getRandomColor(ball) {
                    //var colours = ['#3f3f3f', '#2d2d2d', '#1d1d1d'];
                    var colours = ['#444444', '#2d2d2d', '#161616'];
                    if(!ball.colour) {
                        ball.colour = colours[Math.floor(Math.random() * 3)];
                    }
                    return ball.colour;
                }

                /*function getBubbleColor(radius) {
                    var colours = ['#444444', '#2d2d2d', '#161616'];
                    if(radius < (minSize + (maxSize-minSize)/3)) {
                        return colours[2];
                    }
                    else if(radius < (minSize + (maxSize-minSize)/3*2)) {
                        return colours[1];
                    }
                    else {
                        return colours[0];
                    }
                }*/

                function render() {
                    var ball;

                    context.lineWidth = 1;
                    for (var i = 0; i <balls.length; i++) {
                        ball = balls[i];
                        ball.x = ball.nextx;
                        ball.y = ball.nexty;
                        ball.colour = getRandomColor(ball);

                        context.beginPath();
                        context.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
                        context.closePath();
                        context.strokeStyle = ball.colour;
                        context.stroke();
                    }

                }

                function collide() {
                    var ball;
                    var testBall;
                    for (var i = 0; i <balls.length; i++) {
                        ball = balls[i];
                        for (var j = i+1; j < balls.length; j++) {
                                testBall = balls[j];
                                if (hitTestCircle(ball,testBall)) {
                                    collideBalls(ball,testBall);
                                }
                            }
                        }
                    }

                function hitTestCircle(ball1,ball2) {
                    var retval = false;
                    var dx = ball1.nextx - ball2.nextx;
                    var dy = ball1.nexty - ball2.nexty;
                    var distance = (dx * dx + dy * dy);
                    if (distance <= (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius)
                        ) {
                            retval = true;
                        }
                        return retval;
                    }

                function collideBalls(ball1,ball2) {

                    var dx = ball1.nextx - ball2.nextx;
                    var dy = ball1.nexty - ball2.nexty;

                    var collisionAngle = Math.atan2(dy, dx);

                    var speed1 = Math.sqrt(ball1.velocityx * ball1.velocityx +
                        ball1.velocityy * ball1.velocityy);
                    var speed2 = Math.sqrt(ball2.velocityx * ball2.velocityx +
                        ball2.velocityy * ball2.velocityy);

                    var direction1 = Math.atan2(ball1.velocityy, ball1.velocityx);
                    var direction2 = Math.atan2(ball2.velocityy, ball2.velocityx);

                    var velocityx_1 = speed1 * Math.cos(direction1 - collisionAngle);
                    var velocityy_1 = speed1 * Math.sin(direction1 - collisionAngle);
                    var velocityx_2 = speed2 * Math.cos(direction2 - collisionAngle);
                    var velocityy_2 = speed2 * Math.sin(direction2 - collisionAngle);

                    var final_velocityx_1 = ((ball1.mass - ball2.mass) * velocityx_1 +
                        (ball2.mass + ball2.mass) * velocityx_2)/(ball1.mass + ball2.mass);
                    var final_velocityx_2 = ((ball1.mass + ball1.mass) * velocityx_1 +
                        (ball2.mass - ball1.mass) * velocityx_2)/(ball1.mass + ball2.mass);

                    var final_velocityy_1 = velocityy_1;
                    var final_velocityy_2 = velocityy_2;

                    ball1.velocityx = Math.cos(collisionAngle) * final_velocityx_1 +
                        Math.cos(collisionAngle + Math.PI/2) * final_velocityy_1;
                    ball1.velocityy = Math.sin(collisionAngle) * final_velocityx_1 +
                        Math.sin(collisionAngle + Math.PI/2) * final_velocityy_1;
                    ball2.velocityx = Math.cos(collisionAngle) * final_velocityx_2 +
                        Math.cos(collisionAngle + Math.PI/2) * final_velocityy_2;
                    ball2.velocityy = Math.sin(collisionAngle) * final_velocityx_2 +
                        Math.sin(collisionAngle + Math.PI/2) * final_velocityy_2;

                    ball1.nextx = (ball1.nextx += ball1.velocityx);
                    ball1.nexty = (ball1.nexty += ball1.velocityy);
                    ball2.nextx = (ball2.nextx += ball2.velocityx);
                    ball2.nexty = (ball2.nexty += ball2.velocityy);
                }
                //var numBalls = 30;
                //var maxSize = 40;
                //var minSize = 8;
                var windowWidth = $(window).width();
                var numBalls = windowWidth / 40;
                var maxSize = windowWidth / 30;
                var minSize = windowWidth / 150;
                var maxSpeed = 5;
                var borderOffset = 100;
                var balls = new Array();
                var tempBall;
                var tempX;
                var tempY;
                var tempSpeed;
                var tempAngle;
                var tempRadius;
                var tempRadians;
                var tempvelocityx;
                var tempvelocityy;
                var friction = 0; //.01;

                //var canvas = document.getElementById("canvasOne");
                var canvas = elem.find('canvas')[0];
                context = canvas.getContext("2d");

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                function getMousePos(canvas, evt) {
                    var rect = canvas.getBoundingClientRect();
                    return {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                    };
                }

                var mousePos
                //canvas.addEventListener('mousemove', function(evt) {
                window.addEventListener('mousemove', function(evt) {
                    mousePos = getMousePos(canvas, evt);
                }, false);

                //window.addEventListener('resize', function(evt) {
                    //console.log($(window).width());
                    //mousePos = getMousePos(canvas, evt);
                //});

                for (var i = 0; i < numBalls; i++) {
                    tempRadius = Math.floor(Math.random()*maxSize)+minSize;
                    var placeOK = false;
                    while (!placeOK) {
                        tempX = tempRadius*3 + (Math.floor(Math.random()*canvas.width)
                            -tempRadius*3);
                        tempY = tempRadius*3 + (Math.floor(Math.random()*canvas.height)
                            -tempRadius*3);
                        tempSpeed = (maxSpeed-tempRadius)/200;
                        tempAngle = Math.floor(Math.random()*360);
                        tempRadians = tempAngle * Math.PI/ 180;
                        tempvelocityx = Math.cos(tempRadians) * tempSpeed;
                        tempvelocityy = Math.sin(tempRadians) * tempSpeed;

                        tempBall = {x:tempX,y:tempY,radius:tempRadius, speed:tempSpeed,
                            angle:tempAngle, velocityx:tempvelocityx, velocityy:tempvelocityy,
                            mass:tempRadius*8, nextx: tempX, nexty:tempY};
                        placeOK = canStartHere(tempBall);
                    }
                    balls.push(tempBall);
                }

                function canStartHere(ball) {
                    var retval = true;
                    for (var i = 0; i <balls.length; i++) {
                        if (hitTestCircle(ball, balls[i])) {
                            retval = false;
                        }
                    }
                    return retval;
                }
                function animationLoop() {
                    if(window.requestAnimationFrame) {
                        window.requestAnimationFrame(animationLoop);
                    }
                    else {
                        window.setTimeout(animationLoop, 20);
                    }
                    drawScreen()
                }
                animationLoop();



            }
        };
    })