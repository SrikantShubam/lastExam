// "use client";

// import { motion } from "framer-motion";
// import { FiUpload, FiMail } from "react-icons/fi";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function ContributeSection() {
//   return (
//     <section className="relative py-16 px-4 sm:px-6 lg:py-24 lg:px-8 bg-background text-foreground">
//       <div className="max-w-5xl mx-auto flex items-center justify-center gap-8">
//         {/* Left Minimal Graphic */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 0.2, x: 0 }}
//           transition={{ duration: 1 }}
//           className="w-24 h-48 bg-foreground/10 rounded-full blur-xl"
//         />

//         {/* Centered Contribute Content */}
//         <div className="max-w-lg w-full">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="mb-8 text-center"
//           >
//             <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Contribute
//             </h2>
//             <p className="text-muted-foreground text-sm">
//               Share resources, request exams, or join as a counselor—all in one place.
//             </p>
//           </motion.div>

//           {/* Single Minimal Form */}
//           <motion.form
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="space-y-6 border rounded-lg p-6 bg-background hover:bg-muted/10 transition-colors dark:hover:bg-muted/20"
//           >
//             {/* Contribution Type Dropdown */}
//             <div>
//               <Label htmlFor="contribution-type" className="text-muted-foreground">
//                 Contribution Type
//               </Label>
//               <Select defaultValue="submit-pyqs">
//                 <SelectTrigger id="contribution-type" className="mt-1">
//                   <SelectValue placeholder="Select an option" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="submit-pyqs">Submit PYQs</SelectItem>
//                   <SelectItem value="request-exam">Request Exam</SelectItem>
//                   <SelectItem value="join-counselor">Join as Counselor/Educator</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* File Upload for PYQs */}
//             <div>
//               <Label htmlFor="file" className="text-muted-foreground">
//                 Upload Files (PYQs, Answer Keys, etc.)
//               </Label>
//               <Input id="file" type="file" accept=".pdf,.jpg,.png" className="mt-1" />
//             </div>

//             {/* Message / Resource Information */}
//             <div>
//               <Label htmlFor="message" className="text-muted-foreground">
//                 Your Message / Resource Information
//               </Label>
//               <Textarea
//                 id="message"
//                 placeholder="E.g., JEE Mains 2022 PYQs, Physics expertise, or exam request"
//                 className="mt-1"
//               />
//             </div>

//             {/* Email for Counselor */}
//             <div>
//               <Label htmlFor="email" className="text-muted-foreground">
//                 Your Email (Required for Counselors)
//               </Label>
//               <Input id="email" type="email" className="mt-1" />
//             </div>

//             {/* Submit Button */}
//             <Button type="submit" className="w-full">
//               <FiUpload className="mr-2 h-4 w-4" />
//               Submit Contribution
//             </Button>
//           </motion.form>

//           {/* Contact Link */}
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="text-center text-muted-foreground mt-4 text-sm"
//           >
//             Questions?{" "}
//             <a href="mailto:support@examtards.com" className="text-primary hover:underline">
//               <FiMail className="inline h-4 w-4 mr-1" />
//               Contact us
//             </a>
//           </motion.p>
//         </div>

//         {/* Right Minimal Graphic */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 0.2, x: 0 }}
//           transition={{ duration: 1 }}
//           className="w-24 h-48 bg-foreground/10 rounded-full blur-xl"
//         />
//       </div>
//     </section>
//   );
// }
"use client";

import { motion } from "framer-motion";
import { FiUpload, FiMail } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

export default function ContributeSection() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      contributionType: "submit-pyqs",
    },
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const contributionType = watch("contributionType");

  const onSubmit = async (data) => {
    setSubmissionStatus("submitting");
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("contributionType", data.contributionType);
    // Only append file if it exists
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }
    formData.append("message", data.message);

    try {
      const response = await fetch("/api/submit-contribution", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmissionStatus("success");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error(error);
      setSubmissionStatus("error");
    }
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:py-24 lg:px-8 bg-background text-foreground">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-8">
        {/* Left Minimal Graphic */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1 }}
          className="w-24 h-48 bg-foreground/10 rounded-full blur-xl"
        />

        {/* Centered Contribute Content */}
        <div className="max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Contribute
            </h2>
            <p className="text-muted-foreground text-sm">
              Share resources, request exams, or join as a counselor—all in one place.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 border rounded-lg p-6 bg-background hover:bg-muted/10 transition-colors dark:hover:bg-muted/20"
          >
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-muted-foreground">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Contribution Type Dropdown */}
            <div>
              <Label htmlFor="contribution-type" className="text-muted-foreground">
                Contribution Type
              </Label>
              <Controller
                name="contributionType"
                control={control}
                rules={{ required: "Please select a contribution type" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue="submit-pyqs"
                  >
                    <SelectTrigger id="contribution-type" className="mt-1">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submit-pyqs">Submit PYQs</SelectItem>
                      <SelectItem value="request-exam">Request Exam</SelectItem>
                      <SelectItem value="join-counselor">Join as Counselor/Educator</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.contributionType && (
                <p className="text-red-500 text-sm mt-1">{errors.contributionType.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="file" className="text-muted-foreground">
                Upload Files (PYQs, Answer Keys, etc.)
              </Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.png"
                {...register("file", {
                  validate: (files) =>
                    contributionType === "submit-pyqs" && !files[0]
                      ? "File is required for submitting PYQs"
                      : true,
                })}
                className="mt-1"
              />
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
              )}
            </div>

            {/* Message / Resource Information */}
            <div>
              <Label htmlFor="message" className="text-muted-foreground">
                Your Message / Resource Information
              </Label>
              <Textarea
                id="message"
                placeholder="E.g., JEE Mains 2022 PYQs, Physics expertise, or exam request"
                {...register("message", { required: "Message is required" })}
                className="mt-1"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={submissionStatus === "submitting"}>
              <FiUpload className="mr-2 h-4 w-4" />
              {submissionStatus === "submitting" ? "Submitting..." : "Submit Contribution"}
            </Button>

            {/* Submission Status */}
            {submissionStatus === "success" && (
              <p className="text-green-500 text-sm text-center">Submission successful!</p>
            )}
            {submissionStatus === "error" && (
              <p className="text-red-500 text-sm text-center">Submission failed. Please try again.</p>
            )}
          </motion.form>

          {/* Contact Link */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-muted-foreground mt-4 text-sm"
          >
            Questions?{" "}
            <a href="mailto:support@examtards.com" className="text-primary hover:underline">
              <FiMail className="inline h-4 w-4 mr-1" />
              Contact us
            </a>
          </motion.p>
        </div>

        {/* Right Minimal Graphic */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1 }}
          className="w-24 h-48 bg-foreground/10 rounded-full blur-xl"
        />
      </div>
    </section>
  );
}