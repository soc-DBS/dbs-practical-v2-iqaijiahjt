const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const util = require('util');


function getMeanCourseFee() {
    return prisma.course.aggregate({
        _avg: {
            crseFee: true,
        }
    })
}


/** Section A */

function getNumberOfFullTimeStaff() {
    return prisma.staff.aggregate({

        where: {
            typeOfEmployment: 'FT', 
        },
        _count: {
            staffNo: true, 
        }
    });
}

/** Section B */

function getTotalAllowanceOfStaffByGrade() {
    return prisma.staff.groupBy({
        by: ['grade'],
        _sum: {
            allowance: true,
        },
        where: {
            grade: {
                not: {
                    startsWith: 'S',
                },
            },
            allowance: {
                not: null,
            },
        },
        orderBy: {
            grade: 'desc',
        },
    });
}


function getTotalPayAndNoOfStaffByDeptWithHighTotal() {
    return prisma.staff.groupBy({
        by: ['deptCode'],
        _sum: {
            pay: true,
        },
        _count: {
            staffNo: true,
        },
        where: {
            deptCode: {
                not: 'DPO', 
            },
        },
        having: {
            pay: {
                _sum: {
                    gt: 20000, 
                },
            },
        },
        orderBy: {
            _sum: {
                pay: 'desc',
            },
        },
    });
}

/** Using Raw Query */


function getAvgLabFeeWithRawQuery() {
    return prisma.$queryRaw`SELECT AVG(COALESCE(lab_fee, 0)) AS "Mean Lab Fee" FROM course;`
}


async function main(argument) {
    let results;
    switch (argument) {
        case 'getMeanCourseFee':
            results = await getMeanCourseFee();
            break;
        case 'getNumberOfFullTimeStaff':
            results = await getNumberOfFullTimeStaff();
            break;
        case 'getTotalAllowanceOfStaffByGrade':
            results = await getTotalAllowanceOfStaffByGrade();
            break;                        
        case 'getTotalPayAndNoOfStaffByDeptWithHighTotal':
            results = await getTotalPayAndNoOfStaffByDeptWithHighTotal();
            break;            
        case 'getAvgLabFeeWithRawQuery':
            results = await getAvgLabFeeWithRawQuery()
            break;            
        default:
            console.log('Invalid argument');
    }
    results && console.log(util.inspect(results, { showHidden: false, depth: null, colors: true }));
}

main(process.argv[2]);
