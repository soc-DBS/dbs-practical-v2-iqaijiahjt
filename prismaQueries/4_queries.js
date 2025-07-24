const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const util = require('util');

function getAllStaff() {
	return prisma.staff.findMany({
	})
}

/** Section A: Basic Queries */


function getHodInfo() {
	return prisma.department.findMany({
		// TODO: Implement the query
		// List the department name and head of department start date of all departments.
		select: {
			deptName: true,
			hodApptDate: true
		}
	});
}


function getDeptStaffingInfo() {
	return prisma.department.findMany({
		//TODO: Implement the query
		select: {
			deptName: true,
			noOfStaff: true
		},
		orderBy: [{
			noOfStaff: 'desc',
		}]
	});
}


/** Section B: Filtering Queries */


function getStaffofSpecificCitizenships() {
	const desiredCitizenship = ["Hong Kong", "Korea", "Malaysia", "Thailand"];
	return prisma.staff.findMany({
		//TODO: Implement the query
		// 		List the staff that hold citizenships from Hong Kong, Korea,
		//      Malaysia and Thailand in the order as shown

		select: {
			citizenship: true,
			staffName: true
		},
		where: {
			citizenship: {
				in: desiredCitizenship 
			}
		},
		orderBy: [{
			citizenship: 'asc'
		}]
	});
}


function getStaffByCriteria1() {
	return prisma.staff.findMany({
		//TODO: Implement the query
		// Among the married staff, list male staff who are paid
        // between 4000 and 7000 or male staff who are paid
        // between 2000 and 6000. Sort in ascending order of gender,
        // pay

		select: {
			gender: true,
			pay: true,
			maritalStatus: true,
			staffName: true
		},
        where: {
            OR: [
                { 
                    gender: 'F', 
                    pay: {
                        gte: 4000, 
                        lte: 7000  
                    },
					maritalStatus: 'M'
                },
                { 
                    gender: 'M', 
                    pay: {
                        gte: 2000, 
                        lte: 6000  
                    },
					maritalStatus: 'M'
                }
            ]
        },
		orderBy: [{
			gender: 'asc'
		}]


	});
}


/** Section C: Relation Queries */

async function getDepartmentCourses() {
        //TODO: Implement the query
        return prisma.department.findMany({
            orderBy: {
              deptName: 'asc'
            },
            select: {
              deptName: true,
              course: {
                select: {
                  crseName: true,
                  crseFee: true,
                  labFee: true
			
                }
              }
            }
          });
}


const getStaffAndDependents = () => {
	return prisma.staff.findMany({
		//TODO: Implement the query
		// List the staff with their dependents and relationship,
		//  in ascending order of
        //  staff name.
        //  List only staff with at least one dependent.
    orderBy: {
		staffName: 'asc'
	}, 
	select: {
        staffName: true,
		
		staffDependent: {
			select: {
				dependentName: true,
				relationship: true

			}
		},
		}
	});
};

const getDepartmentCourseStudentDob = () => {
	return prisma.department.findMany({
		//TODO: Implement the query
		// List the name of department, course,
		// student and the date of birth of the student.
        // List only those records where the department 
		// has at least one course and
        // where the course has at least one student
        // Sort the result in ascending order of course name, 
		// department name and
		// descending order age of student
		select: {
			deptName: true,
			course: {
				where: {
					student: {
						some: {}
					}
				},
				select:{
					crseName: true,
					student: {
						select: {
							studName: true,
							dob: true
						},
						orderBy: {
							dob: 'desc'
						}
					}
				}
			}
		},
		where: {
			course: {
				some: {}
			}
		},
		orderBy: [
            {
                course: {
                    _count: 'asc' 
                }
            },
            {
                deptName: 'asc'
            }
        ]

	});
};

async function main(argument) {
	let results;
	switch (argument) {
		case 'getAllStaff':
			results = await getAllStaff();
			break;
		case 'getHodInfo':
			results = await getHodInfo();
			break;
		case 'getDeptStaffingInfo':
			results = await getDeptStaffingInfo();
			break;
		case 'getStaffofSpecificCitizenships':
			results = await getStaffofSpecificCitizenships();
			break;
		case 'getStaffByCriteria1':
			results = await getStaffByCriteria1();
			break;
		case 'getDepartmentCourses':
			results = await getDepartmentCourses();
			break;
		case 'getStaffAndDependents':
			results = await getStaffAndDependents();
			break;
		case 'getDepartmentCourseStudentDob':
			results = await getDepartmentCourseStudentDob();
			break;
		default:
			console.log('Invalid argument');
			break;
	}
	results && console.log(util.inspect(results, { showHidden: false, depth: null, colors: true }));
}

main(process.argv[2]);
