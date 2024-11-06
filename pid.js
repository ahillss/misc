
function leastSquaresLine3(xs,ys,n) {
  var sumX=0,sumX2=0,sumY=0,sumXY=0;

    
  //for(var i=n-1;i>=0;i--)
  for(var i=0;i<n;i++)
  {
      var x=xs[i];
      var y=ys[i];

      
    sumX+=x;
    sumX2+=x*x;
    sumY+=y;
    sumXY+=x*y;
  }

  // www.efunda.com/math/leastsquares/lstsqr1dcurve.cfm
  var m=(n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX);
  // b=(sumY*sumX2-sumX*sumXY)/(n*sumX2-sumX*sumX);

  // youtu.be/1pawL_5QYxE
  //var b=(sumY-m*sumX)/n;

  //
  //return {gradient:m,intercept:b};
  return m;
}


function leastSquaresLine(space,ys) {
    //var sumX=ys.reduce((t,y)=>t+space);
    //var sumX2=ys.reduce((t,y)=>t+space*space);
    
    var sumX=0,sumX2=0,sumY=0,sumXY=0;
    var x=0;
    
    for(var i=0;i<ys.length;i++) {
        var y=ys[i];

        sumX+=x;
        sumX2+=x*x;
        sumY+=y;
        sumXY+=x*y;
    
        x+=space;
    }

  // www.efunda.com/math/leastsquares/lstsqr1dcurve.cfm
  return (ys.length*sumXY-sumX*sumY)/(ys.length*sumX2-sumX*sumX);
}


function trapezoidRule(space,ys) {
    var s=ys[0]+ys[ys.length-1];
    
    for(var i=1;i<ys.length-1;i++) {
        s+=2*ys[i];
    }
    
    var b=space*ys.length;
    var n=ys.length-1;
    return (b/(2*n))*s;
}

function trapezoidRule2(space,ys) {
    return ((space*ys.length)/(2*(ys.length-1)))*(ys[0]+ys.slice(1,ys.length-1).reduce((b,a)=>b+2*a)+ys[ys.length-1]);
}

function arrayShiftInsert(a,v) {
    for(var i=1;i<a.length;i++) {
        a[i]=a[i-1];
    }
    
    a[0]=v;
}

function pidController(dt,errs) {
    var P=errs[0];
    var I=trapezoidRule(dt,errs);
    var D=-leastSquaresLine(dt,errs);
    return [P,I,D];
}


function vec3_dot(a,b) {
    return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
}

function vec2_vecmin(out,v,m) {
    var len=vec2_length(v[0],v[1]);
    var tmp=v.slice();
    
    if(len>0) {
        tmp[0]/=len;
        tmp[1]/=len;
        len=Math.min(len,m);
        tmp[0]*=len;
        tmp[1]*=len;
    }
    
    out[0]=tmp[0];
    out[1]=tmp[1];
    
    return out;
}


function vec2_length(a,b) {
    return Math.sqrt(a*a+b*b);
}

function clampRadiansRange(rad) {
    return rad+((rad<-Math.PI)?Math.PI*2:0)-((rad>=Math.PI)?Math.PI*2:0);
}

function test() {
	var worldCursor=[10,20];
	
    var entity={
        position:[0,0],
        velocity:[0,0],
        nearest:[],
        facing:0, //a
        targetFacing:0, //a
        turnRate:2.5,
        thrust:[0,0],
        thrustMax:50,
        xThrustErrs:(new Array(3)).fill(0),
        yThrustErrs:(new Array(3)).fill(0),
        thrustPIDRatios:[1.01,0.1,8.8],//[1,1,20],
        dimFront:8,
        dimBack:-7,
    };
	
	var dt=0.1;
	
	for(var i=0;i<200;i++) {
		
		
		//
		var xDiff=worldCursor[0]-entity.position[0];
		var yDiff=worldCursor[1]-entity.position[1];
		var bearing=Math.atan2(yDiff,xDiff);


		arrayShiftInsert(entity.xThrustErrs,xDiff);
		arrayShiftInsert(entity.yThrustErrs,yDiff);
		
		
		var xPID=pidController(dt,entity.xThrustErrs);
		var yPID=pidController(dt,entity.yThrustErrs);

		entity.thrust[0]=vec3_dot(xPID,entity.thrustPIDRatios);
		entity.thrust[1]=vec3_dot(yPID,entity.thrustPIDRatios);
		
	   vec2_vecmin(entity.thrust,entity.thrust,entity.thrustMax);

	   /*if(i==0) {
			log((bearing*(180/Math.PI)).toFixed(1),'bearing');
		
			log(entity.xThrustErrs.map(x=>x.toFixed(2)),'entity.xThrustErrs');
			log(entity.yThrustErrs.map(x=>x.toFixed(2)),'entity.yThrustErrs');
			
			log([xPID[0],yPID[0]].map(x=>x.toFixed(2)),"P");
			log([xPID[1],yPID[1]].map(x=>x.toFixed(2)),"I");
			log([xPID[2],yPID[2]].map(x=>x.toFixed(2)),"D");
			  log(entity.thrust.map(x=>x.toFixed(2)),'entity[0].thrust');
			  log(vec2_length(entity.thrust[0],entity.thrust[1]).toFixed(2),'entity[0].thrustSpeed');
			  log(vec2_length(entity.velocity[0],entity.velocity[1]).toFixed(2),'entity[0].speed');
	   }*/
	   


		entity.targetFacing=Math.atan2(entity.thrust[1],entity.thrust[0]);
		
		//
        //log(entity.facing.toFixed(5),'entity.facing');
        //log(entity.targetFacing.toFixed(5),'entity.targetFacing');
        
        var dx=Math.cos(entity.facing);
        var dy=Math.sin(entity.facing);
        
		var px=entity.position[0]+dx*entity.dimBack;
		var py=entity.position[1]+dy*entity.dimBack;
		var vx=entity.velocity[0]-dx*dt*2000;
		var vy=entity.velocity[1]-dy*dt*2000;
		//entity.velocity[0]-entity.thrust[0]*dt*q,entity.velocity[1]-entity.thrust[1]*dt*q
		if(Math.abs(entity.facing-entity.targetFacing)<0.01) {
            //createParticle(px,py,vx,vy,2,[1,0.9,0.3]);
            
            entity.velocity[0]+=entity.thrust[0]*dt;
            entity.velocity[1]+=entity.thrust[1]*dt;
            
            
        }
		
		//
		
        entity.position[0]+=entity.velocity[0]*dt;
        entity.position[1]+=entity.velocity[1]*dt;
		
		//
        var diff=clampRadiansRange(entity.targetFacing-entity.facing);
        var diffDir=Math.sign(diff);
        var diffAmount=Math.abs(diff);
        
        entity.facing=clampRadiansRange((entity.turnRate*dt>diffAmount)?entity.targetFacing:(entity.facing+diffDir*entity.turnRate*dt));
        
		
		//
		console.log(i+": "+ entity.position);
		
	}

}

test();