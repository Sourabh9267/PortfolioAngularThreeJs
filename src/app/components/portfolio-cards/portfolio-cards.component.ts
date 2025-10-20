import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
@Component({
  selector: 'app-portfolio-cards',
  templateUrl: './portfolio-cards.component.html',
  styleUrls: ['./portfolio-cards.component.scss'],
  imports: [NgFor]
})
export class PortfolioCardsComponent {
  projects = [
    { title: 'Project One', description: 'Description for project one.', background: '/assets/project1.jpg' },
    { title: 'Project Two', description: 'Description for project two.', background: '/assets/project2.jpg' },
    { title: 'Project Three', description: 'Description for project three.', background: '/assets/project3.jpg' },
    { title: 'Project Four', description: 'Description for project four.', background: '/assets/project4.jpg' },
  ];
}