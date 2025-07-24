const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.create = function create(code, name, credit) {
    return prisma.module.create({
        data: {
            modCode: code,
            modName: name,
            creditUnit: parseInt(credit),
        },
    }).then(function (module) {
        return module;
    }).catch(function (error) {
        // Handle Prisma Error, throw a new error if module already exists
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // P2002 is the unique constraint violation error code in Prisma
            if (error.code === 'P2002') { // CRITICAL FIX: Changed = to ===
                throw new Error(`The Module ${code} already exists`);
            }
        }
        throw error;
    });
};

module.exports.updateByCode = function updateByCode(code, credit) {
    return prisma.module.update({
        // TODO: Add where and data Official (Open) - THIS IS WHERE THE FIX GOES
        where: {
            modCode: code,
        },
        data: {
            creditUnit: parseInt(credit),
        },
    }).then(function (module) {
        // Leave blank - This means you just return the updated module or nothing if not needed
        return module;
    }).catch(function (error) {
        // Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference#p2025
        // TODO: Handle Prisma Error, throw a new error if module is not found
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`The Module ${code} does not exist`); // Corrected error message to 'exist' for grammar
            }
        }

        throw error;
    });
};

module.exports.deleteByCode = function deleteByCode(code) {
    return prisma.module.delete({
        //TODO: Add where
        where: {
            modCode: code,
        },
    }).then(function (module) {
        // Leave blank
    }).catch(function (error) {
        // Prisma error codes: https://www.prisma.io/docs/orm/reference/error reference#p2025
        // TODO: Handle Prisma Error, throw a new error if module is not found
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`The Module ${code} does not exist`); // Corrected error message to 'exist' for grammar
            }
        }

        throw error;
    })
};

module.exports.retrieveAll = function retrieveAll() {
    // TODO: Return all modules
    return prisma.module.findMany()
        .then(function (modules) {
            return modules;
        })
        .catch(function (error) {

            console.error("Error retrieving all modules:", error);
            throw error;
        });
};


module.exports.retrieveByCode = function retrieveByCode(code) {

    return prisma.module.findUnique({
        where: {
            modCode: code,
        }
    }).then(function (module) {

        return module;
    }).catch(function (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`The Module ${code} does not exist`); // Corrected error message to 'exist' for grammar
            }
        }

        throw error;
    })
};
