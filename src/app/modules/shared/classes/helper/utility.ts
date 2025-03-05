import { DatePipe } from "@angular/common";
import { CONSTANTS } from "./constant";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Role } from "../../models/role.model";


@Injectable({
    providedIn: 'root'
})
export class Utility {
    public static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    public static isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    public static convertToLanguageObject(firstNameArray: { firstName: string }[], lastNameArray: { lastName: string }[], nameArray: { name: string }[], addressArray: { address: string }[], activeLang: string, disableLang: string): { [key: string]: string } {
        const result: { [key: string]: string } = {};

        if (firstNameArray.length > 0) {
            result[activeLang] = firstNameArray[0].firstName;
        }

        if (firstNameArray.length > 1) {
            result[disableLang] = firstNameArray[1].firstName;
        }
        if (lastNameArray.length > 0) {
            result[activeLang] = lastNameArray[0].lastName;
        }

        if (lastNameArray.length > 1) {
            result[disableLang] = lastNameArray[1].lastName;
        }
        if (nameArray.length > 0) {
            result[activeLang] = nameArray[0].name;
        }

        if (nameArray.length > 1) {
            result[disableLang] = nameArray[1].name;
        }
        if (addressArray.length > 0) {
            result[activeLang] = addressArray[0].address;
        }

        if (addressArray.length > 1) {
            result[disableLang] = addressArray[1].address;
        }

        return result;
    }
    public static generatePassword(): string {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    public static parseToDate(dateValue?: string, format?: string) {
        var datePipe = new DatePipe(CONSTANTS.LOCALE_EN_US, "+00:00");
        return new Date(datePipe.transform(dateValue ?? new Date(), format ? format : CONSTANTS.FORMAT_DATE_TIME)) ?? null;
    }

    public static formatValue(value: any): any {
        if (value === "") {
            return [];
        }
        return value;
    }

    public static adjustStartAndEndDates(startDateString: string, endDateString: string): { startDateUTC: string, endDateUTC: string } {
        const startDate = new Date(startDateString);
        startDate.setHours(0, 0, 0, 0); // Set to 00:00:00

        const endDate = new Date(endDateString);
        endDate.setHours(23, 59, 59, 999); // Set to 23:59:59

        // Convert both dates to UTC format
        const startDateUTC = startDate.toISOString();
        const endDateUTC = endDate.toISOString();

        return {
            startDateUTC: startDateUTC.replace('Z', '+00:00'), // Change the format if needed
            endDateUTC: endDateUTC.replace('Z', '+00:00')
        };
    }
    /**
 * setFormControlValue
 */
    public static setFormControlValue(
        form: FormGroup,                // Accept the form as a parameter
        controlName: string,
        dataArray: any[],
        key: string,
        idKey: string = 'id',
        isMultiple: boolean = false,
    ): void {
        const values = dataArray
            .filter(item => item[key] && item[key].id)
            .map(item => item[idKey]);

        if (values && isMultiple) {
            // Set the control value as an array
            form.get(controlName)?.setValue(values);
        } else if (values.length > 0) {
            // Set the control value as a single value (the first one)
            form.get(controlName)?.setValue(values[0]);
        } else {
            form.get(controlName)?.setValue([]);
        }
    }
    /**
 * setFormControlValue
 */
    public static setFormControlValueSingle(
        form: FormGroup,                // Accept the form as a parameter
        controlName: string,
        value: any,
    ): void {
        if (value) {
            // Set the control value as an array
            form.get(controlName)?.setValue(value);
        }
    }

    public static getSuperAdminRoles(): Role[] {
        const userRole: Role[] = [
            { id: '1', name: 'Super Admin' },
            { id: '2', name: 'Asset Owner Admin' },
            { id: '3', name: 'Contractor Admin' },
        ]
        return userRole;
    }
    public static getAssetAdminRoles(): Role[] {
        const userRole: Role[] = [    
            { id: '2', name: 'Asset Owner Admin' }, 
            { id: '6', name: 'Task Viewer' },
        ]
        return userRole;
    }
    public static getContractorAdminRoles(): Role[] {
        const userRole: Role[] = [    
            { id: '3', name: 'Contractor Admin' },
            { id: '5', name: 'Task Submitter' },
            { id: '6', name: 'Task Viewer' },
        ]
        return userRole;
    }
    public static formatSize(sizeInBytes: number) {
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;

        if (sizeInBytes >= gb) {
            return (sizeInBytes / gb).toFixed(2) + ' GB';
        } else if (sizeInBytes >= mb) {
            return (sizeInBytes / mb).toFixed(2) + ' MB';
        } else if (sizeInBytes >= kb) {
            return (sizeInBytes / kb).toFixed(2) + ' KB';
        } else {
            return sizeInBytes + ' Bytes';
        }
    };

    public static moveArrayElement(array, fromIndex, toIndex) {
        const element = array.splice(fromIndex, 1)[0];

        if (array[toIndex] === undefined) array[toIndex] = [];

        array.splice(toIndex, 0, element);
        return array;
    }

    static multiOptionRequiredFor = ["select", "radio", "checkbox"];

    public static setYearRange(lifeSpanId: string) {
        var startDate, endDate: string;
        const currentYear = new Date().getFullYear();
        let yearsSpan = parseInt(lifeSpanId); // Convert selected ID (1, 2, 3) to integer

        if (yearsSpan >= 1) {
            startDate = (currentYear - (yearsSpan - 1)).toString(); // Subtract to get the start year
            endDate = currentYear.toString(); // Current year as end year
        } else {
            console.error('Invalid lifeSpanId provided'); // Error handling
        }
        return { startDate, endDate };
    }

    public static getColumnHeaders(activeLang: string): { [key: string]: string } {
        var columns = {
            en: {
                year: 'Year',
                evaluator: 'Evaluator',
                planningSkills: 'Planning and organization skills',
                sellingSkills: 'Selling skills',
                reporting: 'Reporting',
                personalSkills: 'Personal skills'
            },
            ar: {
                year: 'السنة',
                evaluator: 'المقيم',
                planningSkills: 'مهارات التخطيط والتنظيم',
                sellingSkills: 'مهارات البيع',
                reporting: 'التقارير',
                personalSkills: 'المهارات الشخصية'
            },
            // Add other languages as needed
        };
        return columns[activeLang] || columns['en']; // Fallback to English if language not found
    }
    public static getColumnHeadersRating(activeLang: string): { [key: string]: string } {
        var columns = {
            en: {
                year: 'Year',
                evaluator: 'Evaluator',
                overAllPerformanceRating: 'OverAll Performance Rating',
            },
            ar: {
                year: 'السنة',
                evaluator: 'المقيم',
                overAllPerformanceRating: 'تقييم الأداء الشامل',
            },
            // Add other languages as needed
        };
        return columns[activeLang] || columns['en']; // Fallback to English if language not found
    }

    public static getColumnHeadersMonth(activeLang: string): { [key: string]: string } {
        var columns = {
            en: {
                month: 'Month',
                evaluator: 'Evaluator',
                rating: 'OverAll Performance Rating',
            },
            ar: {
                month: 'السنة',
                evaluator: 'المقيم',
                rating: 'تصنيف',

            },
            // Add other languages as needed
        };
        return columns[activeLang] || columns['en']; // Fallback to English if language not found
    }

    public static getColumnHeadersS(activeLang: string): { [key: string]: string } {
        const columns = {
            en: {
                year: 'Year',
                evaluator: 'Evaluator',
                action: 'Action',
                objectives: 'Objectives',
                summaryOfPerformance: 'Summary of Performance'
            },
            ar: {
                year: 'السنة',
                evaluator: 'المقيم',
                action: 'الإجراء',
                objectives: 'الأهداف',
                summaryOfPerformance: 'ملخص الأداء'
            },
            // Add other languages as needed
        };
        return columns[activeLang] || columns['en']; // Fallback to English if language not found
    }
    public static getColumnHeadersSubObjectives(activeLang: string): { [key: string]: string } {

        const columns = {
            en: {
                createdBy: 'Created By',
                asignedTo: 'Assigned To',
                title: 'Title',
                priority: 'Priority',
                type: 'Type',
                description: 'Description',
                startDate: 'Start Date',
                endDate: 'End Date',
                status: 'Status',
                progress: 'Progress',
                createdAt: 'Created At',
            },
            ar: {
                createdBy: 'تم الإنشاء بواسطة',
                asignedTo: 'تم التعيين إلى',
                title: 'العنوان',
                priority: 'الأولوية',
                type: 'النوع',
                description: 'الوصف',
                startDate: 'تاريخ البداية',
                endDate: 'تاريخ النهاية',
                status: 'الحالة',
                progress: 'التقدم',
                createdAt: 'تاريخ الإنشاء',
            },
        };
        return columns[activeLang] || columns['en']; // Fallback to English if language not found
    }

    public static groupBy(data, prop, relat?) {
        return data.reduce((acc, item) => {
            // Access the value of the property dynamically using bracket notation
            function safeGet(obj, path) {
                return path.reduce((current, key) => (current && current[key] !== undefined) ? current[key] : undefined, obj);
            }

            const key = safeGet(item, [prop, 0, prop, 'id']) ||
                safeGet(item, [prop, 'id']) ||
                safeGet(item, [prop, 0, relat, 'id']) ||
                safeGet(item, [prop, 0, 'id']) ||
                safeGet(item, [prop]);
            // Adjust if prop is complex
            if (key) {
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
            }
            return acc;
        }, {});
    }
    public static getProductName(productGroup, productKey) {
        return productGroup
            .flatMap(item =>
                item.categories
                    .filter(category => category.categoryId === productKey)
                    .map(category => category.category?.name) // Adjust if `name` is within `category`
            )
            .find(name => name)
    }

    public static groupByCategory(data: any[], productIds?: string[]) {
        if (productIds) {
            return productIds.reduce((acc, productId) => {
                // Filter data for the current productId
                const filteredData = data.filter(item =>
                    item?.categories.some(category => category.categoryId === productId)
                );

                // Group the filtered data by categoryId within categories
                acc[productId] = filteredData;
                return acc;
            }, {});
        } else {
            return data.reduce((acc, item) => {
                const categoryId = item.categoryId;

                // Check if the categoryId already exists in the accumulator
                if (!acc[categoryId]) {
                    acc[categoryId] = {
                        category: item.category, // Add the category object itself (or just the name if you want)
                        items: [],
                    };
                }

                // Push the item into the corresponding category group
                acc[categoryId].items.push(item);

                return acc;
            }, {});

        }
    }

    public static reportList = [
        { "id": 1, "name": { "en": "Comprehensive Reports", "ar": "تقارير شاملة" } },
        { "id": 2, "name": { "en": "Objectives Report", "ar": "تقرير الأهداف" } },
        { "id": 3, "name": { "en": "Distribution Report", "ar": "تقرير التوزيع" } },
        { "id": 4, "name": { "en": "In-store Task Report", "ar": "تقرير المهام داخل المتجر" } },
        { "id": 5, "name": { "en": "Promotion Evaluation Report", "ar": "تقرير تقييم الترويج" } },
        { "id": 6, "name": { "en": "Competitor Promotion Report", "ar": "تقرير ترويج المنافسين" } },
        { "id": 7, "name": { "en": "New Product Launch Report", "ar": "تقرير إطلاق منتج جديد" } },
        { "id": 8, "name": { "en": "Branding & Monthly Display Report", "ar": "تقرير العلامة التجارية والعرض الشهري" } },
        { "id": 9, "name": { "en": "Competitor Branding Report", "ar": "تقرير العلامة التجارية للمنافس" } },
        { "id": 10, "name": { "en": "Marketing Campaign Report", "ar": "تقرير الحملة التسويقية" } },
        { "id": 11, "name": { "en": "Shelf Share Report", "ar": "تقرير نسبة العرض" } },
        { "id": 12, "name": { "en": "Price Survey Report", "ar": "تقرير مسح الأسعار" } },
        { "id": 13, "name": { "en": "Achievement Report", "ar": "تقرير الإنجازات" } },
        { "id": 14, "name": { "en": "Questionnaire Report", "ar": "تقرير الاستبيان" } },
        { "id": 15, "name": { "en": "Consumer Survey Report", "ar": "تقرير مسح المستهلكين" } },
        { "id": 16, "name": { "en": "Monthly Employee Evaluation Report", "ar": "تقرير التقييم الشهري للموظفين" } },
        { "id": 17, "name": { "en": "Yearly Employee Evaluation Report", "ar": "تقرير التقييم السنوي للموظفين" } },
        { "id": 18, "name": { "en": "Yearly And Visibility Contracts Report", "ar": "تقرير العقود السنوية والتواجد" } },
        { "id": 19, "name": { "en": "Secondary Contracts Report", "ar": "تقرير العقود الثانوية" } }
    ]
    public static analyzers = [
        { "id": "country", "name": { "en": "Country", "ar": "دولة" } },
        { "id": "region", "name": { "en": "Region", "ar": "منطقة" } },
        { "id": "subRegion", "name": { "en": "Sub Region", "ar": "منطقة فرعية" } },
        { "id": "branch", "name": { "en": "Branch", "ar": "فرع" } },
    ]
    public static shelfLifeOptions = [
        { "id": '1d', "name": { en: '1 day', ar: 'يوم واحد' } },
        { "id": '1w', "name": { en: '1 week', ar: 'أسبوع واحد' } },
        { "id": '2w', "name": { en: '2 weeks', ar: 'أسبوعين' } },
        { "id": '1m', "name": { en: '1 month', ar: 'شهر واحد' } },
        { "id": '2m', "name": { en: '2 months', ar: 'شهرين' } },
        { "id": '3m', "name": { en: '3 months', ar: '3 أشهر' } },
        { "id": '6m', "name": { en: '6 months', ar: '6 أشهر' } },
        { "id": '1y', "name": { en: '1 year', ar: 'سنة واحدة' } },
        { "id": '2y', "name": { en: '2 years', ar: 'سنتين' } },
        { "id": '3y', "name": { en: '3 years', ar: '3 سنوات' } }
    ];
    public static lifeSpam = [
        { "id": '1', "name": { en: '1 year', ar: 'سنة واحدة' } },
        { "id": '2', "name": { en: '2 years', ar: 'سنتان' } },
        { "id": '3', "name": { en: '3 years', ar: 'ثلاث سنوات' } },
    ];


    public static getObjectiveLabels = ['Open', 'In Progress', 'Completed', 'Closed', 'Fail', 'Overdue', 'Draft', 'Expired', 'New', 'Resolved', 'Active'];
    public static months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


}

