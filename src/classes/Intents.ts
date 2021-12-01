import BitsBlock from './blocks/BitsBlock';
import { Intents as IntentFlags } from '../util/Constants';

export default class Intents extends BitsBlock {

    static FLAGS = IntentFlags;

    constructor (...flags: number[]) {
        super(...flags);
    }

}
