import { Component, OnInit } from '@angular/core';
import { RssService } from '../services/rss.service';

@Component({
  selector: 'app-guest-blog',
  templateUrl: './guest-blog.component.html',
  styleUrls: ['./guest-blog.component.scss']
})
export class GuestBlogComponent implements OnInit {
  news: any[] = [];

  constructor(private rssService: RssService) { }

  ngOnInit() {
    this.rssService.getNews().subscribe(data => {
      this.news = data;
    });
  }
}
