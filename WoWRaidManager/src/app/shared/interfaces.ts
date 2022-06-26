import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { Items } from '../loot-manager/loot-config/models/items';
import { Buffs } from '../roster/models/Buffs';
import { SpecData } from '../roster/models/SpecData';


export interface ICharacter {
    charName: string;
    main: boolean;
    mainsCharacterName: string;
    primarySpec: SpecData;
    offSpec: SpecData;
}

export interface IBuffs {
    buffCode: string;
    buffText: string;
    buffName: string;
    buffWeight: number;
}

export interface IClasses {
    value: string;
    viewValue: string;
}

export interface ISpecs {
    value: string;
    viewValue: string;
}

export interface ISpecs {
    value: string;
    viewValue: string;
}

