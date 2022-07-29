import { Component, Input, OnInit } from '@angular/core';
import { TopicValue } from 'src/app/core/models/values/topic-value';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  @Input() value: TopicValue;
  @Input() size: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
