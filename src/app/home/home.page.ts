import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { IonDatetime } from '@ionic/angular';
import { stringify } from 'querystring';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  prizeData: any;
  categorysList = [];
  selectedCategory = "";
  selectedYear: Date;
  filteredYear: any;
  commanIds = [];
  moreThenOne = [];
  constructor(public api: ApiService) {

  }
  async ngOnInit() {
    console.log("ngOnInit");
    this.prizeData = await this.api.getNodalData();
    this.getCategerys();
  }
  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.getDuplicates();
  }

  getCategerys() {
    var catArray = this.prizeData.prizes.reduce((accumalator, current) => {
      if (!accumalator.some((item) => item.category === current.category)) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);
    catArray.forEach((element, index) => {
      this.categorysList[index] = element.category;
    });
    console.log(this.categorysList);
  }


  yearOnchange() {
    if (this.selectedYear) {
      this.filteredYear = new Date(this.selectedYear).getFullYear() + "";
      console.log(this.filteredYear);
    }
  }

  filteredData() {
    console.log(this.selectedCategory)
    console.log(this.selectedYear)

    if (this.prizeData && this.prizeData?.prizes.length)
      if (this.selectedCategory && this.selectedYear) {
        return this.prizeData?.prizes.filter(t => (t.category === this.selectedCategory) && (t.year === this.filteredYear.toString()));
      } else if (this.selectedCategory) {
        return this.prizeData?.prizes.filter(t => (t.category === this.selectedCategory));
      } else if (this.filteredYear) {
        return this.prizeData?.prizes.filter(t => (t.year === (this.filteredYear)));
      } else {
        console.log("dfdf")
        return this.prizeData?.prizes.filter(t => (1900 < Number(t.year) && Number(t.year) < 2018))
      }

  }
  getDuplicates() {

    let members = [];
    if (this.prizeData?.prizes) {
      this.prizeData.prizes.forEach(element => {
        if (element.laureates && element.laureates.length) {
          element.laureates.forEach(element2 => {
            members.push(element2);
          });
        }
      });
      console.log(members);
      //   let unique = [...new Set(va.map(propYoureChecking => propYoureChecking.id))];
      //   if (unique.length > 1) {
      //     console.log(unique);
      //   }
      // }


      // const values = [{ id: 10, name: 'someName1' }, { id: 10, name: 'someName2' }, { id: 11, name: 'someName3' }, { id: 12, name: 'someName4' }];
      let more = [];
      let duplicates = [];
      const lookup = members.reduce((a, e) => {
        a[e.id] = ++a[e.id] || 0;
        return a;
      }, {});

      console.log(members.filter(e => lookup[e.id]));
      // var ee =
      duplicates = members.filter(e => lookup[e.id])
      duplicates.forEach(element => {
        if (element.share > 1) {
          more.push(element)
        }
      });
      this.moreThenOne = more.reduce(function (previous, current) {
        var object = previous.filter(object => object.id === current.id);
        if (object.length == 0) {
          previous.push(current);
        }
        return previous;
      }, []);

      console.log(this.moreThenOne);

    }
  }
}