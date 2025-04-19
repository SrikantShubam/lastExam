// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";

// const StartScreen = ({ paperData, hasPreviousAttempt, onStartExam }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleStartClick = () => {
//     if (hasPreviousAttempt) {
//       setIsModalOpen(true);
//     } else {
//       onStartExam(true);
//     }
//   };

//   return (
//     <section className="py-12 px-6 md:px-12 lg:px-24 bg-background text-foreground min-h-screen flex items-center justify-center">
//       <div className="text-center max-w-2xl mx-auto">
//         <h1 className="text-3xl font-bold mb-4">{paperData.paper_name}</h1>
//         <p className="text-muted-foreground mb-2">Exam: {paperData.exam}</p>
//         <p className="text-muted-foreground mb-2">Subject: {paperData.subject}</p>
//         <p className="text-muted-foreground mb-2">Total Questions: {paperData.total_questions}</p>
//         <p className="text-muted-foreground mb-2">Positive Marking: +{paperData.positive_marking || 1}</p>
//         <p className="text-muted-foreground mb-2">Negative Marking: -{paperData.negative_marking || 0.25}</p>
//         <p className="text-muted-foreground mb-6">Total Time: {paperData.total_time || "2 hours"}</p>
//         <p className="text-muted-foreground mb-4">
//           Do not disconnect. You are going to see an ad before the start and at the end.
//         </p>
//         <Button onClick={handleStartClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
//           Start Exam
//         </Button>

//         {/* Modal for Previous Attempt Prompt */}
//         <Transition show={isModalOpen}>
//   <Dialog onClose={() => setIsModalOpen(false)} className="relative z-50">
//     {/* backdrop */}
//     <Transition.Child
//       enter="ease-out duration-300"
//       enterFrom="opacity-0"
//       enterTo="opacity-100"
//       leave="ease-in duration-200"
//       leaveFrom="opacity-100"
//       leaveTo="opacity-0"
//     >
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//     </Transition.Child>

//     {/* panel */}
//     <Transition.Child
//       enter="ease-out duration-300"
//       enterFrom="opacity-0 scale-95"
//       enterTo="opacity-100 scale-100"
//       leave="ease-in duration-200"
//       leaveFrom="opacity-100 scale-100"
//       leaveTo="opacity-0 scale-95"
//     >
//       <DialogPanel
//         className="
//           fixed top-1/2 left-1/2
//           transform -translate-x-1/2 -translate-y-1/2
//           bg-background rounded-lg shadow-lg
//           p-8 pb-12           /* more bottom padding */
//           space-y-6            /* larger gap */
//           max-w-sm w-full
//         "
//       >
//         <DialogTitle className="text-lg font-semibold dark:text-white text-zinc-950">
//           Previous Attempt Detected
//         </DialogTitle>

//         <p className="text-muted-foreground">
//           You have a previous attempt in progress. Would you like to continue or start a new exam?
//         </p>

//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
//           <Button
//             variant="outline"
//             onClick={() => {
//               setIsModalOpen(false);
//               onStartExam(false);
//             }}
//             className="bg-neutral-600 text-primary-foreground hover:bg-primary/90 hover:text-black py-3 w-full sm:w-auto"
//           >
//             Continue Previous Attempt
//           </Button>
//           <Button
//             onClick={() => {
//               setIsModalOpen(false);
//               onStartExam(true);
//             }}
//             className="bg-primary text-primary-foreground hover:bg-primary/90 py-3 w-full sm:w-auto"
//           >
//             Start New Attempt
//           </Button>
//         </div>
//       </DialogPanel>
//     </Transition.Child>
//   </Dialog>
// </Transition>

//       </div>
//     </section>
//   );
// };

// export default StartScreen;


import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";

const StartScreen = ({ paperData, hasPreviousAttempt, onStartExam }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartClick = () => {
    if (hasPreviousAttempt) {
      setIsModalOpen(true);
    } else {
      onStartExam(true); // Start new directly if no previous attempt
    }
  };

  return (
    <section className="py-12 px-6 md:px-12 lg:px-24 bg-background text-foreground min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{paperData.paper_name}</h1>
        <p className="text-muted-foreground mb-2">Exam: {paperData.exam}</p>
        <p className="text-muted-foreground mb-2">Subject: {paperData.subject}</p>
        <p className="text-muted-foreground mb-2">Total Questions: {paperData.total_questions}</p>
        <p className="text-muted-foreground mb-2">Positive Marking: +{paperData.positive_marking || 1}</p>
        <p className="text-muted-foreground mb-2">Negative Marking: -{paperData.negative_marking || 0.25}</p>
        <p className="text-muted-foreground mb-6">Total Time: {paperData.total_time || "2 hours"}</p>
        <p className="text-muted-foreground mb-4">
          Do not disconnect. You are going to see an ad before the start and at the end.
        </p>
        <Button onClick={handleStartClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Start Exam
        </Button>

        {/* Modal for Previous Attempt Prompt */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog onClose={() => setIsModalOpen(false)} className="relative z-50">
            {/* Backdrop */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            </Transition.Child>

            {/* Centering Container */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* Dialog Panel - Fixed width to prevent overflow */}
                <DialogPanel className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
                  <DialogTitle className="text-lg font-semibold text-foreground">
                    Previous Attempt Detected
                  </DialogTitle>

                  <p className="mt-2 text-sm text-muted-foreground">
                    You have a previous attempt in progress. Would you like to continue or start a new exam?
                  </p>

                  {/* Button container with proper spacing */}
                  <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        onStartExam(false); // Continue
                      }}
                      className="w-full text-black dark:text-white sm:w-auto"
                    >
                      Continue Previous Attempt
                    </Button>
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                        onStartExam(true); // Start New
                      }}
                      className="w-full sm:w-auto"
                    >
                      Start New Attempt
                    </Button>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </section>
  );
};

export default StartScreen;