import { Injectable } from '@angular/core';
import { ICharacter } from '../shared/interfaces';

@Injectable()
export class TrackByService {

  character(index: number, character: ICharacter) {
    return character.char_name;
  }
}