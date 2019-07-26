package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a logical section of field sets.
 */
public class EditorFormSection {

    private String name;
    List<EditorFormFieldSet> fieldSets = new ArrayList<>();
    private String displayName;
    private Double rank;
    private Double priority;
    private String description;

    public EditorFormSection() {
    }

    public EditorFormSection(String name, String displayName, String description, Double rank, Double priority, List<EditorFormFieldSet> fieldSets) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.rank = rank;
        this.priority = priority;
        this.fieldSets = fieldSets;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the name (aka identifier) of the section")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the displayable name of the section")
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @GraphQLField
    @GraphQLDescription("Returns the description of the section")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
    }

    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

    @GraphQLField
    @GraphQLName("fieldSets")
    @GraphQLDescription("Returns the field sets contained in this section")
    public List<EditorFormFieldSet> getFieldSets() {
        return fieldSets;
    }

    public void setFieldSets(List<EditorFormFieldSet> fieldSets) {
        this.fieldSets = fieldSets;
    }
}