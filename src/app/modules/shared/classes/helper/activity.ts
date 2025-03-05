import { inject, Injectable } from "@angular/core";
import { ActivityList } from "../../models/activityList.model";
import { BranchAssignemnt, CountryAssignemnt, RegionAssignemnt, SubRegionAssignemnt } from "../../models/assignments.model";
import { Utility } from "./utility";

@Injectable({
    providedIn: 'root',  // This makes the service available globally
})
export class Activity {

    private _activityService = inject(ActivityListUsecases);

    createCountryAssignment(item: any): CountryAssignemnt[] {
        let countryAssignment: CountryAssignemnt[] = [];
        if (item) {
            countryAssignment.push({
                countryId: item?.countryId,
                id: item?.id,
            });
        }
        return countryAssignment;
    }
    createRegionAssignment(item: any): RegionAssignemnt[] {
        let regionAssignment: RegionAssignemnt[] = [];
        if (item) {
            regionAssignment.push({
                regionId: item?.regionId,
                id: item?.id,
            });
        }
        return regionAssignment;
    }
    createSubRegionAssignment(item: any): SubRegionAssignemnt[] {
        let subRegionAssignment: SubRegionAssignemnt[] = [];
        if (item) {
            subRegionAssignment.push({
                subRegionId: item?.subRegionId,
                id: item?.id,
            });
        }
        return subRegionAssignment;
    }
    createBranchAssignment(item: any): BranchAssignemnt[] {
        let branchAssignment: BranchAssignemnt[] = [];
        if (item) {
            branchAssignment.push({
                branchId: item?.branchId,
                id: item?.id,
            });
        }
        return branchAssignment;
    }

   
}