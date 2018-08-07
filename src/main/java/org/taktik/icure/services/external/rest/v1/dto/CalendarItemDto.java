package org.taktik.icure.services.external.rest.v1.dto;

import org.taktik.icure.entities.Place;
import org.taktik.icure.services.external.rest.v1.dto.embed.AddressDto;

public class CalendarItemDto extends IcureDto {

    protected String title;

    protected CalendarItemDto type;

    protected String patient;

    protected Boolean homeVisit;

    protected AddressDto address;

    protected String addressText;

    protected Long startTime;

    protected Long endTime;

    protected Long duration;

    protected String details;

    protected String agenda;

    protected Place place;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public CalendarItemDto getType(){
        return type;
    }

    public void setType(CalendarItemDto type){
        this.type = type;
    }

    public String getPatient() {
        return patient;
    }

    public void setPatient(String patient) {
        this.patient = patient;
    }

    public Boolean getHomeVisit() {
        return homeVisit;
    }

    public void setHomeVisit(Boolean homeVisit) {
        this.homeVisit = homeVisit;
    }

    public AddressDto getAddress() {
        return address;
    }

    public void setAddress(AddressDto address) {
        this.address = address;
    }

    public String getAddressText() {
        return addressText;
    }

    public void setAddressText(String addressText) {
        this.addressText = addressText;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getAgenda() {
        return agenda;
    }

    public void setAgenda(String agenda) {
        this.agenda = agenda;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }
}
