import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { Buffs } from '../roster/models/Buffs';
import { SpecData } from '../roster/models/SpecData';


export interface ICharacter {
    charName: string;
    main: string;
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