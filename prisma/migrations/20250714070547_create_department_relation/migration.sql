-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_dept_code_fkey" FOREIGN KEY ("dept_code") REFERENCES "department"("dept_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "dept_hod_fk" FOREIGN KEY ("hod") REFERENCES "staff"("staff_no") ON DELETE NO ACTION ON UPDATE NO ACTION;
