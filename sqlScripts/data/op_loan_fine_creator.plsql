SET SERVEROUTPUT ON;

DECLARE
  v_user_id NUMBER;
  v_book_id NUMBER;
  v_loaned_at TIMESTAMP;
  v_returned_at TIMESTAMP;
  v_is_returned NUMBER;
  v_returned_on_time NUMBER;
  v_minute_offset NUMBER := 0;

BEGIN
    v_user_id := TRUNC(DBMS_RANDOM.VALUE(1, 5));
    SELECT id INTO v_book_id FROM (
      SELECT id FROM books ORDER BY dbms_random.value
    ) WHERE rownum = 1;

    v_loaned_at := TO_TIMESTAMP('01-JAN-2024 00:00:00', 'DD-MON-YYYY HH24:MI:SS') + NUMTODSINTERVAL(DBMS_RANDOM.VALUE(0, 132 * 24 * 60) + v_minute_offset, 'MINUTE');
    v_minute_offset := v_minute_offset + 1;

    v_is_returned := CASE WHEN DBMS_RANDOM.VALUE(0, 1) < 0.8 THEN 1 ELSE 0 END;

    IF v_is_returned = 1 THEN
      v_returned_on_time := CASE WHEN DBMS_RANDOM.VALUE(0, 1) < 0.75 THEN 1 ELSE 0 END;
      v_returned_at := CASE
        WHEN v_returned_on_time = 1 THEN
          v_loaned_at + NUMTODSINTERVAL(DBMS_RANDOM.VALUE(0, 14 * 24 * 60), 'MINUTE')
        ELSE
          v_loaned_at + NUMTODSINTERVAL((14 * 24 * 60) + DBMS_RANDOM.VALUE(0, 30 * 24 * 60), 'MINUTE')
        END;
    ELSE
      v_returned_at := NULL;
    END IF;

    DBMS_OUTPUT.PUT_LINE('Inserting: BookID=' || v_book_id || ' UserID=' || v_user_id || ' LoanedAt=' || v_loaned_at || ' ReturnedAt=' || v_returned_at);

    INSERT INTO LOANEDBOOKS (BOOKID, USERID, LOANEDAT, RETURNEDAT) VALUES (v_book_id, v_user_id, v_loaned_at, v_returned_at);
    
    COMMIT;
END;