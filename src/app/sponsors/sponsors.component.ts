import { Component, OnInit } from '@angular/core'
import { ContentfulService } from '../contentful.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements OnInit {

  sponsorshipLevels
  sponsors

  constructor (private contentful: ContentfulService) { }

  ngOnInit () {
    this.contentful.getSponsors().subscribe(sponsors => this.sponsors = sponsors)

    this.contentful.getSponsorshipLevels().subscribe(levels => {
      this.sponsorshipLevels = levels.sort((a, b) => a.fields.order - b.fields.order)

    })
  }

}
