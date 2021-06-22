import { registerEnumType } from "type-graphql";

export enum PropertyCondition {
    EXCELLENT = "excellent",
    VERY_GOOD = "very_good",
    GOOD = "good",
    AVERAGE_TO_GOOD = "average_to_good",
    AVERAGE = "average",
    FAIR_TO_AVERAGE = "fair_to_average",
    FAIR = "fair",
    POOR = "poor",
    VERY_POOR = "very_poor",
    DILAPIDATED = "dilapidated"
}

registerEnumType(PropertyCondition, {
    name: "PropertyCondition",
    description: "Estado de conservacion del inmueble. Mas info en: https://www.spartanburgcounty.org/DocumentCenter/View/291/Physical-Condition-Codes"
})