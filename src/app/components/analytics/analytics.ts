import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  // Mock metrics
  metrics = [
    { label: 'Active Students', value: 128 },
    { label: 'Courses Completed', value: 54 },
    { label: 'Avg. Completion %', value: '72%' },
    { label: 'Revenue (30d)', value: '$1,240' },
  ];

  trends = [
    { label: 'Week 1', value: 10 },
    { label: 'Week 2', value: 18 },
    { label: 'Week 3', value: 28 },
    { label: 'Week 4', value: 42 },
  ];
}
