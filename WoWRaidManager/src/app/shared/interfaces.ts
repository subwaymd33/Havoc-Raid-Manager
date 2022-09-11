import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { Items } from '../loot-manager/loot-config/models/items';
import { Buffs } from '../roster/models/Buffs';
import { SpecData } from '../roster/models/SpecData';


export interface ICharacter {
    char_name: string;
    rank: string;
    mains_name: string;
    primarySpec: SpecData;
    offSpec: SpecData;
}

export interface IBuffs {
    buff_code: string;
    buff_text: string;
    buff_name: string;
    buff_weight: number;
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

