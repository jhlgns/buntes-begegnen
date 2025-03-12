SELECT
    activities.*,
    -- recurrenceByDay.Ordinal AS RecurrenceByDay_Ordinal,
    -- recurrenceByDay.DayOfWeek AS RecurrenceByDay_DayOfWeek,
    -- recurrenceByMonthDay.MonthDay AS RecurrenceByMonthDay_MonthDay,
    @userId IS NOT NULL AND registrations.ActivityId IS NOT NULL
        AS IsRegistered,
    (
        SELECT COUNT(*)
        FROM UserActivityRegistrations
        WHERE ActivityId == activities.Id
    )
        AS CurrentNumberOfParticipants

FROM Activities activities
LEFT JOIN UserActivityRegistrations registrations
    ON @userId IS NOT NULL
        AND registrations.ActivityId == activities.Id
        AND registrations.UserId == @userId
-- LEFT JOIN ActivityRecurrenceByDay recurrenceByDay
--     ON recurrenceByDay.ActivityId == activities.Id
-- LEFT JOIN ActivityRecurrenceByMonthDay recurrenceByMonthDay
--     ON recurrenceByMonthDay.ActivityId == activities.Id

WHERE activities.IsDeleted == 0
    AND (  -- Find single activity
        @onlyId IS NULL
            OR activities.Id == @onlyId
    )
    AND (  -- Full text search
        @searchPattern IS NULL
            OR LOWER(activities.Title) LIKE LOWER(@searchPattern)
                OR LOWER(activities.Description) LIKE LOWER(@searchPattern)
    )
    AND (  -- Limit by minDate and maxDate - NOTE: Can only be used in conjunction
        @minDate IS NULL OR @maxDate IS NULL OR
            CASE
                WHEN
                    activities.RecurrenceFrequency == 0  -- None
                THEN
                    activities.EndTime >= @minDate AND activities.StartTime <= @maxDate
                ELSE
                    activities.RepeatUntil >= @minDate AND activities.StartTime <= @maxDate
            END
    )
    AND (  -- Limit by current user ID if only registered activities
        @onlyRegistered == 0
            OR registrations.UserId == @userId
    )
    AND (  -- Limit by visibility
        -- TODO: Convert to strings to make the queries and database more human readable
        activities.Visibility == 4  -- Public
            OR activities.Visibility == 3  -- SharedDraft
                AND @isTeamMember
            OR activities.Visibility == 2  -- PrivateDraft
                AND @userId IS NOT NULL
                AND activities.CreatedById == @userId
    )

ORDER BY activities.Id
