"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";

import { formatDateTime } from "@/app/lib/utils";
import { useSearchParams, useParams } from "next/navigation";
import Loading from "@/components/Loading";
const RequestSuccess = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const appointmentId = searchParams.get("appointmentId");
  const { id } = params;
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  // const [patientid, setPatientid] = useState<any>(null);

  useEffect(() => {
    if (appointmentId && typeof appointmentId === "string") {
      axios
        .get(`/appointment/get`, { params: { id: appointmentId } })
        .then((response) => {
          const appointment = response.data.appointment;
          setAppointmentDetails(appointment);
          const foundDoctor = Doctors.find(
            (doctor) => doctor.name === appointment.primaryPhysician
          );
          setDoctor(foundDoctor || null);
        })
        .catch((error) =>
          console.error("Error fetching appointment details:", error)
        );
    }
  }, [appointmentId]);

  if (!appointmentDetails || !doctor) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointmentDetails.schedule).dateTime}</p>
          </div>
        </section>
<div className="flex gap-12 ">
  <div><Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patient/${id}/new-appointment`}>New Appointment</Link>
        </Button> </div>
  <div>
        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/payments/checkout`}> Fee Payment</Link>
        </Button>
  </div>

        
</div>
       

        <p className="copyright">© 2024 CarePluse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
