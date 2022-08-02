import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Items } from '../loot-manager/loot-config/models/items';
import { ItemToSpec } from '../loot-manager/loot-config/models/ItemToSpec';
import { specData } from '../loot-manager/loot-config/models/specData';
import { LootService } from '../services/loot.service';
import { ConfigModel } from '../models/configModel';
import { ConfigService } from '../services/config.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LootSheetTableRow } from '../loot-manager/loot-config/models/LootSheetTableRow';
import { unassignedItemsBucket } from '../loot-manager/loot-config/models/unassignedItemsBucket';
import { faAlignJustify, faTriangleExclamation, faArrowCircleLeft, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import { lootSheetInitiateModel } from '../user-page/models/lootSheetInitiateModel';
import { rawSheetDataRow } from '../loot-manager/loot-config/models/rawSheetDataRow';
import { RosterService } from '../services/roster.service';
import { sheetLockModel } from '../loot-manager/loot-config/models/sheetLockModel';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../services/snackbar.service';


@Component({
  selector: 'app-loot-sheet',
  templateUrl: './loot-sheet.component.html',
  styleUrls: ['./loot-sheet.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LootSheetComponent implements OnInit {
  private eventsSubscription: Subscription;
  @Output() ReturnToCharactersEvent = new EventEmitter<any>();
  @Input() characterClass: string;
  @Input() characterName: string;

  @Input() events: Observable<lootSheetInitiateModel>;

  HeaderFormGroup: FormGroup;
  justifyGlyph = faGripLinesVertical;
  warningGlyph = faTriangleExclamation;
  backArrow = faArrowCircleLeft;
  phases: string[] = []
  specs: specData[] = [];
  items: Items[] = [];
  itemToSpecData: ItemToSpec[] = [];
  filteredItems: Items[] = [];
  filteredSpecs: specData[];
  configs: ConfigModel[] = [];
  mainSpecItemtoSpec: ItemToSpec[] = [];
  offSpecItemtoSpec: ItemToSpec[] = [];
  list_ids: string[] = [];
  SlotItem: LootSheetTableRow[] = [];
  UnassignedBucket: unassignedItemsBucket[] = [];
  selectedPhase: number;
  workingCharacterSheetObject: rawSheetDataRow[] = [];
  originalCharacterSheetObject: rawSheetDataRow[] = [];
  charUID: number;
  charRank: string;
  sheetLock: sheetLockModel[] = [];
  isSheetforPhaseLocked: boolean = false;
  disableSubmitButton: boolean = true;
  disableSaveButton: boolean = true;
  disableRevertChangesButton: boolean = true;




  constructor(private lootService: LootService, private configService: ConfigService, private characterService: RosterService, private _snackBarService: SnackbarService) {
    this.HeaderFormGroup = new FormGroup({
      phase_selector: new FormControl(""),
      main_spec_selector: new FormControl(""),
      off_spec_selector: new FormControl(""),
    })



    // for (let i = 50; i > 25; i--) {
    //   var newSlotItem: LootSheetTableRow = new LootSheetTableRow("", "", "", [], [], true, []);
    //   newSlotItem.slot = i.toString();
    //   newSlotItem.column_one_id = (i.toString() + '-1');
    //   this.list_ids.push(newSlotItem.column_one_id)
    //   newSlotItem.column_two_id = (i.toString() + '-2');
    //   this.list_ids.push(newSlotItem.column_two_id)
    //   this.SlotItem.push(newSlotItem)
    // }
    // for (let i = 25; i > 0; i--) {
    //   var newSlotItem: LootSheetTableRow = new LootSheetTableRow("", "", "", [], [], true, []);
    //   newSlotItem.slot = "25";
    //   newSlotItem.column_one_id = ('25-1-' + i.toString());
    //   this.list_ids.push(newSlotItem.column_one_id)
    //   newSlotItem.column_two_id = ('25-2-' + i.toString());
    //   this.list_ids.push(newSlotItem.column_two_id)
    //   this.SlotItem.push(newSlotItem)
    // }

  }

  ngOnInit(): void {

    this.specs = this.filteredSpecs = this.lootService.getSpecData();

    this.lootService.getSpecToItem().subscribe(data => {

      this.itemToSpecData = data
    })

    this.items = this.lootService.getItems()

    this.configs = this.configService.getConfigs()
    this.setPhaseDropdown()

    this.eventsSubscription = this.events.subscribe((data) => this.setFilteredSpecs(data));

  }

  setPhaseDropdown() {
    this.configs.forEach(config => {
      if (config.name == "p1_enable_cb" && config.value == 'true') {
        this.phases.push("Phase 1")
      }
      if (config.name == "p2_enable_cb" && config.value == 'true') {
        this.phases.push("Phase 2")
      }
      if (config.name == "p3_enable_cb" && config.value == 'true') {
        this.phases.push("Phase 3")
      }
      if (config.name == "p4_enable_cb" && config.value == 'true') {
        this.phases.push("Phase 4")
      }
    })
  }

  setFilteredSpecs(dataIn: lootSheetInitiateModel) {
    this.filteredSpecs = this.specs.filter(spec => spec.base_class == dataIn.className)
    this.charRank = dataIn.rank
    if (this.characterName != dataIn.charName) {
      this.HeaderFormGroup.controls['phase_selector'].setValue(0)
      this.HeaderFormGroup.controls['off_spec_selector'].setValue(0)
      this.HeaderFormGroup.controls['main_spec_selector'].setValue(0)

      this.sheetLock.splice(0);
      this.UnassignedBucket.splice(0);
      this.mainSpecItemtoSpec.splice(0);
      this.offSpecItemtoSpec.splice(0);

      this.SlotItem.forEach(si => {
        si.column_one_item_list = [];
        si.column_two_item_list = [];
      })
    }
    this.characterName = dataIn.charName


    this.characterService.getCharUIDByCharName(dataIn.charName).subscribe(name => {
      this.charUID = name[0].charUID
      this.lootService.getLootSheetByCharName(dataIn.charName).subscribe(data => {
        this.workingCharacterSheetObject = data
        this.originalCharacterSheetObject = JSON.parse(JSON.stringify(data))
      })
      this.lootService.getSheetLock(this.charUID).subscribe(data => {
        this.sheetLock = data
        this.ProcessSheet()
      })

    })

    this.SlotItem.splice(0)
    this.list_ids.splice(0)

    if (this.charRank == environment.MAIN_RAIDER_RANK_NAME) {
      for (let i = 50; i > 25; i--) {
        var newSlotItem: LootSheetTableRow = new LootSheetTableRow("", "", "", [], [], true, []);
        newSlotItem.slot = i.toString();
        newSlotItem.column_one_id = (i.toString() + '-1');
        this.list_ids.push(newSlotItem.column_one_id)
        newSlotItem.column_two_id = (i.toString() + '-2');
        this.list_ids.push(newSlotItem.column_two_id)
        this.SlotItem.push(newSlotItem)
      }
    } else {
      for (let i = 0; i < 2; i++) {
        var newSlotItem: LootSheetTableRow = new LootSheetTableRow("", "", "", [], [], true, []);
        newSlotItem.slot = "49";
        newSlotItem.column_one_id = ('49-1-' + i.toString());
        this.list_ids.push(newSlotItem.column_one_id)
        newSlotItem.column_two_id = ('49-2-' + i.toString());
        this.list_ids.push(newSlotItem.column_two_id)
        this.SlotItem.push(newSlotItem)
      }
      for (let i = 48; i > 25; i--) {
        var newSlotItem: LootSheetTableRow = new LootSheetTableRow("", "", "", [], [], true, []);
        newSlotItem.slot = i.toString();
        newSlotItem.column_one_id = (i.toString() + '-1');
        this.list_ids.push(newSlotItem.column_one_id)
        newSlotItem.column_two_id = (i.toString() + '-2');
        this.list_ids.push(newSlotItem.column_two_id)
        this.SlotItem.push(newSlotItem)
      }
    }

    for (let i = 25; i > 0; i--) {
      var newSlotItem: LootSheetTableRow = new LootSheetTableRow("", "", "", [], [], true, []);
      newSlotItem.slot = "25";
      newSlotItem.column_one_id = ('25-1-' + i.toString());
      this.list_ids.push(newSlotItem.column_one_id)
      newSlotItem.column_two_id = ('25-2-' + i.toString());
      this.list_ids.push(newSlotItem.column_two_id)
      this.SlotItem.push(newSlotItem)
    }


  }

  setMainSpec(data: specData) {
    this.HeaderFormGroup.controls['main_spec_selector'].setValue(this.filteredSpecs.find(spec => spec.spec == data.spec))
    this.mainSpecItemtoSpec = this.itemToSpecData.filter(its => its.specUID == data.specUID)
    this.ProcessSheet()
  }

  setOffSpec(data: specData) {
    this.HeaderFormGroup.controls['off_spec_selector'].setValue(this.filteredSpecs.find(spec => spec.spec == data.spec))
    this.offSpecItemtoSpec = this.itemToSpecData.filter(its => its.specUID == data.specUID)
    this.ProcessSheet()
  }

  ProcessSheet() {
    this.disableSaveButton = true;
    this.disableSubmitButton = true;
    this.disableRevertChangesButton = true;


    var myFinalArray = this.mainSpecItemtoSpec.concat(this.offSpecItemtoSpec.filter((item) => this.mainSpecItemtoSpec.indexOf(item) < 0));


    this.items.forEach(item => {
      item.is_offspec = false
    })
    this.filteredItems = this.items.filter(itm => myFinalArray.find(its => its.item_id == itm.item_id && itm.item_phase == this.selectedPhase))
    this.UnassignedBucket.forEach(data => {
      data.items.splice(0)
    })
    this.UnassignedBucket.splice(0)
    this.SlotItem.forEach(si => {
      si.column_one_item_list = [];
      si.column_two_item_list = [];
    })

    this.filteredItems.forEach(item => {
      var timesItemAdded: number = 0;

      if (this.offSpecItemtoSpec.find(its => item.item_id == its.item_id)) {
        item.is_offspec = true
      }
      if (this.mainSpecItemtoSpec.find(its => item.item_id == its.item_id)) {
        item.is_offspec = false
      }
      if (item.item_name.includes("OffSpec")) {
        item.is_offspec = true
      }

      //this code will load the sheet based on the sheet object for the character
      if (this.originalCharacterSheetObject.filter(sheet => sheet.item_id == item.item_id)) {
        var foundSheetObjects = this.originalCharacterSheetObject.filter(sheet => sheet.item_id == item.item_id)
        foundSheetObjects.forEach(founditem => {
          if (founditem.slot.substring(2,4)=="-1") {
            this.SlotItem.find(si => si.column_one_id == founditem.slot)?.column_one_item_list.push(item)
            timesItemAdded += 1
          } else {
            this.SlotItem.find(si => si.column_two_id == founditem.slot)?.column_two_item_list.push(item)
            timesItemAdded += 1
          }
        })
      }



      //this code will load all the remaining items
      var _dontaddOne = false;
      this.SlotItem.forEach(slotItem => {
        if (slotItem.column_one_item_list.length > 0) {
          if (slotItem.column_one_item_list[0].item_id == item.item_id) {
            this.CreateBucket(item);
            _dontaddOne = true
          }
        }
      })
      var _dontaddTwo = false;
      this.SlotItem.forEach(slotItem => {
        if (slotItem.column_two_item_list.length > 0) {
          if (slotItem.column_two_item_list[0].item_id == item.item_id) {
            this.CreateBucket(item);
            _dontaddTwo = true
          }
        }
      })

      //place the item into an unassigned bucket
      if (_dontaddOne == false && _dontaddTwo == false) {
        this.PlaceInBucket(item);
        timesItemAdded += 1
      }

      for (let i = timesItemAdded; i < item.sheet_limit; i++) {

        if (item.item_name.includes("Protector" || "Vanquisher" || "Conqueror") && i > 0) {
          var itemCopy = JSON.parse(JSON.stringify(item))
          itemCopy.is_offspec = true
          this.PlaceInBucket(itemCopy);
        } else {
          this.PlaceInBucket(item);
        }

      }

    })

    this.SlotItem.forEach(slotItem => {
      if (slotItem.column_one_item_list.length > 0) {
        if (!this.filteredItems.find(itm => itm.item_id == slotItem.column_one_item_list[0].item_id)) {
          slotItem.column_one_item_list.splice(0);
        }
      }
      if (slotItem.column_two_item_list.length > 0) {
        if (!this.filteredItems.find(itm => itm.item_id == slotItem.column_two_item_list[0].item_id)) {
          slotItem.column_two_item_list.splice(0);
        }
      }


    })


    //sort the buckets by name
    this.UnassignedBucket.sort((a, b) => ('' + a.slot).localeCompare(b.slot)).forEach(bucket => {
      bucket.items.sort((x, y) => {
        // true values first
        //return (x === y) ? 0 : x ? -1 : 1;
        // false values first
        return (x.is_offspec === y.is_offspec) ? 0 : x ? 1 : -1;
      })
      this.list_ids.push(bucket.slot)
    })

    this.ValidateTable();
  }

  private PlaceInBucket(item: Items) {
    if (this.UnassignedBucket.length == 0 || (typeof this.UnassignedBucket.find(itmbuck => itmbuck.slot == item.item_slot) === 'undefined')) {
      var newBucket = new unassignedItemsBucket(item.item_slot, []);
      newBucket.items.push(item);
      this.UnassignedBucket.push(newBucket);
    } else {
      this.UnassignedBucket.filter(itmbuck => itmbuck.slot == item.item_slot)[0].items.push(item);
    }
  }

  private CreateBucket(item: Items) {
    if (this.UnassignedBucket.length == 0 || (typeof this.UnassignedBucket.find(itmbuck => itmbuck.slot == item.item_slot) === 'undefined')) {
      var newBucket = new unassignedItemsBucket(item.item_slot, []);
      this.UnassignedBucket.push(newBucket);
    }
  }

  dropToColumn(event: CdkDragDrop<Items[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.length == 0) {
        this.disableSaveButton = false;
        this.disableRevertChangesButton = false;
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }

      if (!event.previousContainer.id.includes("-")) {
        //this item was moved from the un-used container
        this.workingCharacterSheetObject.push(new rawSheetDataRow(this.charUID, this.selectedPhase, event.container.data[0].item_id, event.container.id, "false"))
      } else {
        var allObjectsforItemID = this.workingCharacterSheetObject.filter(cso => cso.item_id == event.container.data[0].item_id && cso.phase == this.selectedPhase)
        var sheetLimitForItem = this.items.find(item => item.item_id == event.container.data[0].item_id)!.sheet_limit

        if (allObjectsforItemID.length > 1) {
          if (sheetLimitForItem > allObjectsforItemID.length) {
            //make new row. This should work
            this.workingCharacterSheetObject.push(new rawSheetDataRow(this.charUID, this.selectedPhase, event.container.data[0].item_id, event.container.id, "false"))
          } else {
            //update when the max rows is already in the sheet
            this.workingCharacterSheetObject.find(cso => cso.slot == event.previousContainer.id)!.slot = event.container.id
          }

        } else {
          //there is only one item and we are just moving it around in the sheet
          this.workingCharacterSheetObject.find(cso => cso.item_id == event.container.data[0].item_id)!.slot = event.container.id
        }
      }

      this.ValidateTable()
    }
  }

  drop(event: CdkDragDrop<Items[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.disableRevertChangesButton = false
      this.disableSaveButton = false
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    if (event.previousContainer.id.includes("-")) {
      var spliceIndex = this.workingCharacterSheetObject.findIndex(cso => cso.slot == event.previousContainer.id)
      this.workingCharacterSheetObject.splice(spliceIndex, 1)
    }


    // if (this.workingCharacterSheetObject.find(cso => cso.item_id == event.container.data[0].item_id && cso.phase == this.selectedPhase)) {
    //   var spliceIndex = this.workingCharacterSheetObject.findIndex(cso => cso.item_id == event.container.data[0].item_id)
    //   this.workingCharacterSheetObject.splice(spliceIndex, 1)
    // }
    this.ValidateTable()
  }

  ChangePhase(data: any) {
    this.selectedPhase = parseInt(data.value.substring(data.value.lastIndexOf(" ") + 1))

    //see if sheet is readonly
    if (this.sheetLock.find(sl => sl.phase == this.selectedPhase && sl.locked == 'true')) {
      this.isSheetforPhaseLocked = true
      this.HeaderFormGroup.controls['off_spec_selector'].disable()
      this.HeaderFormGroup.controls['main_spec_selector'].disable()

    } else {
      this.isSheetforPhaseLocked = false
      this.HeaderFormGroup.controls['off_spec_selector'].enable()
      this.HeaderFormGroup.controls['main_spec_selector'].enable()
    }
    if (this.sheetLock.length > 0) {
      if (this.sheetLock.find(sl => sl.phase == this.selectedPhase)!.mainspec) {
        var ret: number = this.sheetLock.find(sl => sl.phase == this.selectedPhase)!.mainspec
        this.setMainSpec(this.filteredSpecs.find(spec => spec.specUID == ret)!)
      }
      if (this.sheetLock.find(sl => sl.phase == this.selectedPhase)!.offspec) {
        var ret: number = this.sheetLock.find(sl => sl.phase == this.selectedPhase)!.offspec
        this.setOffSpec(this.filteredSpecs.find(spec => spec.specUID == ret)!)
      }
    }
    this.ProcessSheet();

  }

  getErrorsForTooltip(slot: LootSheetTableRow) {
    let errors: any;
    if (slot.errors.length > 0) {
      errors = slot.errors.join('\r\n')
    }
    return errors
  }

  ValidateTable() {
    this.SlotItem.forEach(si => { si.errors.splice(0) })

    //this.checkSheetforRowSlotValidity()
    this.checkSheetForRowReservedItemValidity()
    this.checkSheetForBracketValidity()

    var errorCount: number = 0;
    this.SlotItem.forEach(si => {
      if (si.errors.length > 0) {
        errorCount += 1
        si.hideError = false
      } else {
        si.hideError = true
      }
    })
    if (errorCount > 0 || typeof this.selectedPhase === 'undefined') {
      this.disableSubmitButton = true;
    } else {
      this.disableSubmitButton = false;
    }
  }
  checkSheetForBracketValidity() {


    var step: number = 3;
    var currentStartIndex: number = 0

    for (let i = currentStartIndex; i < 5; i++) {
      var spentAP: number = 0;
      var slotsInUseForBracket: string[] = []
      var currentSlice = this.SlotItem.slice((step * i), (step * i) + step)
      currentSlice.forEach(slice => {
        if (slice.column_one_item_list.length > 0) {
          if (slice.column_one_item_list[0].item_ranking != 3) {
            spentAP += 1
          }
          slotsInUseForBracket.push(slice.column_one_item_list[0].item_slot)
        }
        if (slice.column_two_item_list.length > 0) {
          if (slice.column_two_item_list[0].item_ranking != 3) {
            spentAP += 1
          }
          slotsInUseForBracket.push(slice.column_two_item_list[0].item_slot)
        }
      })
      if (spentAP > 3) {
        currentSlice.forEach(slice => {
          slice.errors.push("Bracket Contains too many Red/Blue Items")
        })
      }
      if (slotsInUseForBracket.length > 0) {
        var checkArray: string[] = []
        slotsInUseForBracket.forEach(slot => {
          if (checkArray.includes(slot)) {
            currentSlice.forEach(slice => {
              slice.errors.push("Bracket contains more than one item of type: " + slot)
            })
          } else {
            checkArray.push(slot)
          }
        })
      }
    }

  }
  checkSheetForRowReservedItemValidity() {
    this.SlotItem.forEach(si => {

      if (si.column_one_item_list.length > 0) {
        if ((si.column_one_item_list[0].item_ranking == 1 && si.column_two_item_list.length > 0)) {
          si.errors.push("Error: Slot " + si.slot + " contains a reserved item. No other item can be in this row.")
        }

        if (parseInt(si.slot) > 35) {
          if (si.column_one_item_list[0].is_offspec) {
            si.errors.push("Error: Slot " + si.slot + " contains an offset item. These items must in slot 35 or below.")
          }
        }
      }

      if (si.column_two_item_list.length > 0) {
        if ((si.column_two_item_list[0].item_ranking == 1 && si.column_one_item_list.length > 0)) {
          si.errors.push("Error: Slot " + si.slot + " contains a reserved item. No other item can be in this row.")
        }
        if (parseInt(si.slot) > 35) {
          if (si.column_two_item_list[0].is_offspec) {
            si.errors.push("Error: Slot " + si.slot + " contains an offset item. These items must in slot 35 or below.")
          }
        }
      }


    })
  }
  checkSheetForOffsetLootValidity() {
    this.SlotItem.forEach(si => {
      if (parseInt(si.slot.substring(0, si.slot.indexOf("-"))) <= 35) {

      }
    })
  }

  getItemClassName(item: Items) {

    if (item.is_offspec) {
      return "item-box rank-offspec"
    } else if (item.item_ranking == 3) {
      return "item-box rank-3"
    } else if (item.item_ranking == 2) {
      return "item-box rank-2"
    } else if (item.item_ranking == 1) {
      return "item-box rank-1"
    } else {
      return ""
    }

  }

  SubmitSheet() {
    if (this.sheetLock.find(sl => sl.phase = this.selectedPhase)) {
      this.sheetLock.find(sl => sl.phase = this.selectedPhase)!.locked = 'true'
    } else {
      var mainSpecUID;
      if (typeof this.HeaderFormGroup.controls['main_spec_selector'].value.specUID != 'undefined') {
        mainSpecUID = this.HeaderFormGroup.controls['main_spec_selector'].value.specUID
      } else {
        mainSpecUID = 0
      }
      var offSpecUID
      if (typeof this.HeaderFormGroup.controls['off_spec_selector'].value.specUID != 'undefined') {
        offSpecUID = this.HeaderFormGroup.controls['off_spec_selector'].value.specUID
      } else {
        offSpecUID = 0
      }
      this.sheetLock.push(new sheetLockModel(this.charUID, this.selectedPhase, "true", mainSpecUID, offSpecUID))
    }
    this.isSheetforPhaseLocked = true
    this.HeaderFormGroup.controls['off_spec_selector'].disable()
    this.HeaderFormGroup.controls['main_spec_selector'].disable()

    this.lootService.updateSheetLock(this.sheetLock).subscribe(data => {
      this.SaveSheet(false)
    })
  }
  SaveSheet(fromHTML: boolean) {

    if (this.workingCharacterSheetObject.length > 0) {
      if (fromHTML) {
        if (this.sheetLock.find(sl => sl.phase = this.selectedPhase)) {
          this.sheetLock.find(sl => sl.phase = this.selectedPhase)!.locked = 'false'
        } else {
          var mainSpecUID;
          if (typeof this.HeaderFormGroup.controls['main_spec_selector'].value.specUID != 'undefined') {
            mainSpecUID = this.HeaderFormGroup.controls['main_spec_selector'].value.specUID
          } else {
            mainSpecUID = 0
          }
          var offSpecUID
          if (typeof this.HeaderFormGroup.controls['off_spec_selector'].value.specUID != 'undefined') {
            offSpecUID = this.HeaderFormGroup.controls['off_spec_selector'].value.specUID
          } else {
            offSpecUID = 0
          }
          this.sheetLock.push(new sheetLockModel(this.charUID, this.selectedPhase, "false", mainSpecUID, offSpecUID))
        }
      }
      this.lootService.updateSheetLock(this.sheetLock).subscribe(data => {
        console.log(this.workingCharacterSheetObject)
        this.lootService.saveLootSheet(this.workingCharacterSheetObject).subscribe(data => {
          this.originalCharacterSheetObject = JSON.parse(JSON.stringify(this.workingCharacterSheetObject))
          this.disableSaveButton = true;
          this._snackBarService.openSnackBar("Sheet Saved")
        })

      })

    }
  }
  RevertSheetChanges() {
    this.ProcessSheet()
  }

  ReturnToCharacters() {
    this.ReturnToCharactersEvent.emit('back');
  }
}
