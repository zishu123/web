import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../assets/canvasjs.min';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {  
  ngOnInit() {
	let dataPoints = [];
	let y = 0;		
	for ( var i = 0; i < 500; i++ ) {		  
		y += Math.round(5 + Math.random() * (-5 - 5));	
		dataPoints.push({ y: y});
	}
	let chart = new CanvasJS.Chart("chartContainer", {
		theme: "light2", // "light1", "dark1", "dark2"
		animationEnabled: true,
		zoomEnabled: true,
		title: {
			text: "Try Zooming and Panning"
		},
		axisY: {
			includeZero: false
		},
		data: [
		{
			type: "line",                
			dataPoints: dataPoints
		}]
	});
		
	chart.render();
    }
}
