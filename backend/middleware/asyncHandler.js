// To handle the errors of the synchronous function

export const asyncHandler = (theFunction) => (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
};

// export const asyncHandler = (theFunction) => (req, res, next) => {
//     console.log("NEXT TYPE:", typeof next); // 👈 ADD THIS

//     Promise.resolve(theFunction(req, res, next)).catch((err) => {
//         console.log("ERROR CAUGHT:", err.message);
//         console.log("NEXT TYPE IN CATCH:", typeof next);
//         next(err);
//     });
// };