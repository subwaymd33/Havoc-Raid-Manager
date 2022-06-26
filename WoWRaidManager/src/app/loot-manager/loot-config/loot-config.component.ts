import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { faArrowLeft, faArrowRight, faClose } from '@fortawesome/free-solid-svg-icons';
import { Items } from './models/items';
import { ItemToSpec } from './models/ItemToSpec';
import { rankingModel } from './models/rankingModel';
import { LimitModel } from './models/LimitModel';
import { specData } from './models/specData';
import { LootService } from './services/loot.service';

@Component({
  selector: 'app-loot-config',
  templateUrl: './loot-config.component.html',
  styleUrls: ['./loot-config.component.css']
})
export class LootConfigComponent implements OnInit {
  SheetLimitSelectForm: FormGroup;
  SpecSelectorForm: FormGroup;
  MatSelectForm: FormGroup;
  RankingSelectForm: FormGroup;
  prev_button_disabled = false;
  next_button_disabled = false;
  rightGlyph = faArrowRight;
  leftGlyph = faArrowLeft;
  closeGlyph = faClose;
  hideItemDetailsPane = true;
  //instantiate value for items
  //todo populate from DB
  itemSelectorValues = []
  chosenItem: Items = new Items(0, '', 0, '',0, '','','',0)
  itemLink = ""
  tooltipLink = ""
  items: Items[] = [];
  specData: specData[] = [];
  specToItem: ItemToSpec[] = [];
  rankings: rankingModel[] = [new rankingModel(1,"1 - Red"),new rankingModel(2,"2 - Blue"),new rankingModel(3,"3 - Black")]
  limits: LimitModel[] = [new LimitModel(1,"1 Occurrence"),new LimitModel(2,"2 Occurrences"),new LimitModel(3,"3 Occurrences")]
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 5;


  constructor(private http: HttpClient, private lootService: LootService, private _snackBar: MatSnackBar) {
    this.SpecSelectorForm = new FormGroup({
      dk_blood_cb: new FormControl(false),
      dk_frost_cb: new FormControl(false),
      dk_unholy_cb: new FormControl(false),
      druid_blood_cb: new FormControl(false),
      druid_feral_bear_cb: new FormControl(false),
      druid_feral_cat_cb: new FormControl(false),
      druid_balance_cb: new FormControl(false),
      druid_restoration_cb: new FormControl(false),
      hunter_allspecs_cb: new FormControl(false),
      mage_allspecs_cb: new FormControl(false),
      priest_holy_cb: new FormControl(false),
      priest_discipline_cb: new FormControl(false),
      priest_shadow_cb: new FormControl(false),
      paladin_holy_cb: new FormControl(false),
      paladin_retribution_cb: new FormControl(false),
      paladin_protection_cb: new FormControl(false),
      rogue_allspecs_cb: new FormControl(false),
      shaman_enhancement_cb: new FormControl(false),
      shaman_elemental_cb: new FormControl(false),
      shaman_restoration_cb: new FormControl(false),
      warlock_allspecs_cb: new FormControl(false),
      warrior_arms_cb: new FormControl(false),
      warrior_fury_cb: new FormControl(false),
      warrior_protection_cb: new FormControl(false)
    })

    this.MatSelectForm = new FormGroup({
      item_selector: new FormControl()
    })
    this.RankingSelectForm = new FormGroup({
      ranking_selector: new FormControl()
    })
    this.SheetLimitSelectForm = new FormGroup({
      sheet_limit_selector: new FormControl()
    })
  }

  ngOnInit(): void {
    this.lootService.getItems().subscribe(data => {
      console.log(data);
      this.items = data;
    })

    this.lootService.getSpecData().subscribe(data => {
      console.log(data);
      this.specData = data;
    })

    this.lootService.getSpecToItem().subscribe(data => {
      console.log(data);
      this.specToItem = data;
    })


  }

  setChosenItem(data: Items) {
    this.chosenItem = data;
    this.MatSelectForm.controls['item_selector'].setValue(data)
    this.hideItemDetailsPane = false;
    this.SpecSelectorForm.reset(false)
    this.itemLink = `https://wotlkdb.com?item==${this.chosenItem.wowhead_link}`
    this.tooltipLink = `item=${this.chosenItem.wowhead_link}`
    this.RankingSelectForm.controls['ranking_selector'].setValue(data.item_ranking)
    this.SheetLimitSelectForm.controls['sheet_limit_selector'].setValue(data.sheet_limit)
    

    if (this.chosenItem.item_id == 1) {
      this.prev_button_disabled = true;
    } else {
      this.prev_button_disabled = false
    }
    if (this.chosenItem.item_id == this.items.length) {
      this.next_button_disabled = true
    } else {
      this.next_button_disabled = false
    }


    for (let i = 0; i < this.specToItem.length; i++) {
      if (this.specToItem[i].item_id == this.chosenItem.item_id) {
        for (let j = 0; j < this.specData.length; j++) {
          if (this.specData[j].specUID == this.specToItem[i].specUID) {
            this.setSpecCheckbox(this.specData[j])
          }
        }
      }
    }
  }

  setSpecCheckbox(spec: specData) {
    switch (spec.specUID) {
      case 1: {
        this.SpecSelectorForm.controls['dk_blood_cb'].setValue(true)
        break;
      }
      case 2: {
        this.SpecSelectorForm.controls['warrior_protection_cb'].setValue(true)
        break;
      }
      case 3: {
        this.SpecSelectorForm.controls['paladin_protection_cb'].setValue(true)
        break;
      }
      case 4: {
        this.SpecSelectorForm.controls['druid_feral_bear_cb'].setValue(true)
        break;
      }
      case 5: {
        this.SpecSelectorForm.controls['druid_restoration_cb'].setValue(true)
        break;
      }
      case 6: {
        this.SpecSelectorForm.controls['priest_holy_cb'].setValue(true)
        break;
      }
      case 7: {
        this.SpecSelectorForm.controls['priest_discipline_cb'].setValue(true)
        break;
      }
      case 8: {
        this.SpecSelectorForm.controls['paladin_holy_cb'].setValue(true)
        break;
      }
      case 9: {
        this.SpecSelectorForm.controls['shaman_restoration_cb'].setValue(true)
        break;
      }
      case 10 || 11 | 12: {
        this.SpecSelectorForm.controls['hunter_allspecs_cb'].setValue(true)
        break;
      }
      case 13 || 14 || 15: {
        this.SpecSelectorForm.controls['mage_allspecs_cb'].setValue(true)
        break;
      }
      case 16 || 17 || 18: {
        this.SpecSelectorForm.controls['warlock_allspecs_cb'].setValue(true)
        break;
      }
      case 19: {
        this.SpecSelectorForm.controls['druid_balance_cb'].setValue(true)
        break;
      }
      case 20: {
        this.SpecSelectorForm.controls['priest_shadow_cb'].setValue(true)
        break;
      }
      case 21: {
        this.SpecSelectorForm.controls['shaman_elemental_cb'].setValue(true)
        break;
      }
      case 22 || 23 || 24: {
        this.SpecSelectorForm.controls['rogue_allspecs_cb'].setValue(true)
        break;
      }
      case 25: {
        this.SpecSelectorForm.controls['dk_frost_cb'].setValue(true)
        break;
      }
      case 26: {
        this.SpecSelectorForm.controls['dk_unholy_cb'].setValue(true)
        break;
      }
      case 27: {
        this.SpecSelectorForm.controls['druid_feral_cat_cb'].setValue(true)
        break;
      }
      case 28: {
        this.SpecSelectorForm.controls['warrior_arms_cb'].setValue(true)
        break;
      }
      case 29: {
        this.SpecSelectorForm.controls['warrior_fury_cb'].setValue(true)
        break;
      }
      case 30: {
        this.SpecSelectorForm.controls['paladin_retribution_cb'].setValue(true)
        break;
      }
      case 31: {
        this.SpecSelectorForm.controls['shaman_enhancement_cb'].setValue(true)
        break;
      }
    }
  }

  populateItemToSpecSaveVariable(data: ItemToSpec[]) {

    if (this.SpecSelectorForm.controls['dk_blood_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 1);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['dk_frost_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 25);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['dk_unholy_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 26);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['druid_balance_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 19);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['druid_feral_bear_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 4);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['druid_feral_cat_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 27);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['druid_restoration_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 5);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['hunter_allspecs_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 10);
      data.push(spectoitemObject)

      var spectoitemObject1 = new ItemToSpec(this.chosenItem.item_id, 11);
      data.push(spectoitemObject1)

      var spectoitemObject2 = new ItemToSpec(this.chosenItem.item_id, 12);
      data.push(spectoitemObject2)
    }
    if (this.SpecSelectorForm.controls['mage_allspecs_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 13);
      data.push(spectoitemObject)

      var spectoitemObject1 = new ItemToSpec(this.chosenItem.item_id, 14);
      data.push(spectoitemObject1)

      var spectoitemObject2 = new ItemToSpec(this.chosenItem.item_id, 15);
      data.push(spectoitemObject2)
    }
    if (this.SpecSelectorForm.controls['priest_holy_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 7);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['priest_discipline_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 6);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['priest_shadow_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 20);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['paladin_holy_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 8);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['paladin_retribution_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 30);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['paladin_protection_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 3);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['rogue_allspecs_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 22);
      data.push(spectoitemObject)

      var spectoitemObject1 = new ItemToSpec(this.chosenItem.item_id, 23);
      data.push(spectoitemObject)

      var spectoitemObject2 = new ItemToSpec(this.chosenItem.item_id, 24);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['shaman_enhancement_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 31);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['shaman_elemental_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 21);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['shaman_restoration_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 9);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['warlock_allspecs_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 16);
      data.push(spectoitemObject)

      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 17);
      data.push(spectoitemObject)

      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 18);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['warrior_arms_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 28);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['warrior_fury_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 29);
      data.push(spectoitemObject)
    }
    if (this.SpecSelectorForm.controls['warrior_protection_cb'].value == true) {
      var spectoitemObject = new ItemToSpec(this.chosenItem.item_id, 2);
      data.push(spectoitemObject)
    }
  }

  formSubmit() {
    //this is where ill do the save back
    var spectoItemArray: ItemToSpec[] = []

    this.populateItemToSpecSaveVariable(spectoItemArray)
    this.chosenItem.item_ranking = this.RankingSelectForm.controls['ranking_selector'].value
    this.chosenItem.sheet_limit = this.SheetLimitSelectForm.controls['sheet_limit_selector'].value
    

    this.lootService.addSpecToItemMap(spectoItemArray, this.chosenItem.item_id).subscribe(data => {
      var i = this.specToItem.length
      while (i--) {
        if (this.specToItem[i].item_id == this.chosenItem.item_id) {
          this.specToItem.splice(i, 1);
        }
      }
      spectoItemArray.forEach(data => {
        this.specToItem.push(data)
      })

      this.lootService.UpdateItemRankingAndSheetLimit(this.chosenItem).subscribe(dt => {
        
        this.openSnackBar();
      })
      
    })
  }

  openSnackBar() {
    this._snackBar.open('Saved', 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000
    });
  }

  selectPreviousItem() {
    var currentItemID = this.chosenItem.item_id
    this.items.forEach(item => {
      if (item.item_id == currentItemID - 1) {
        this.MatSelectForm.controls['item_selector'].setValue(item)
        this.setChosenItem(item)
      }
    })
  }

  selectNextItem() {
    var currentItemID = this.chosenItem.item_id
    this.items.forEach(item => {
      if (item.item_id == currentItemID + 1) {
        this.MatSelectForm.controls['item_selector'].setValue(item)
        this.setChosenItem(item)
      }
    })

  }

}
