/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,

  selector: 'app-book-preview',
  templateUrl: './book-preview.component.html',
  styleUrls: ['./book-preview.component.css'],
})
export class BookPreviewComponent implements OnInit {
  data: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.data = this.route.snapshot.data['data'];
  }
}
