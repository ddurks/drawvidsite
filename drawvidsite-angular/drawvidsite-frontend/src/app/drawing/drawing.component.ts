import { Component, OnInit } from '@angular/core';
import { Drawing } from '../drawing';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements OnInit {

  drawing: Drawing = {
    id: null,
    text: null,
    image: null,
    link: null,
    created_date: null
  };

  current_post_number: 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const response = fetch('most_recent_post')
    .then(response => response.json())
    .then(data => {
        this.drawing ={
          id: data.current_num,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        this.current_post_number = data.current_num;
    })
    .catch(error => console.error(error));
  }

  prevDrawing() {
    const response = fetch('prev?curr=' + this.current_post_number)
    .then(response => response.json())
    .then(data => {
        this.drawing ={
          id: data.current_num,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        this.current_post_number = data.current_num;
    })
    .catch(error => console.error(error));
  }

  nextDrawing() {
    const response = fetch('next?curr=' + this.current_post_number)
    .then(response => response.json())
    .then(data => {
        this.drawing ={
          id: data.current_num,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        this.current_post_number = data.current_num;
    })
    .catch(error => console.error(error));
  }

  randomDrawing() {
    const response = fetch('random')
    .then(response => response.json())
    .then(data => {
        this.drawing ={
          id: data.current_num,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        this.current_post_number = data.current_num;
    })
    .catch(error => console.error(error));
  }

}
