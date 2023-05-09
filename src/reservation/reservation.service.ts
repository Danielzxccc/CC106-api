import { client } from '../../config/db'

type Reservation = {
  id: number
  dateofreservation: string
  timerange: string
  product_id: string
}

export async function create(
  details: Omit<Reservation, 'id'>
): Promise<Reservation[]> {
  return client('reservations').insert(details).returning('*')
}

export async function get(
  reservation: string,
  dateofreservation = '2020-01-01',
  timerange = ''
): Promise<Reservation[]> {
  return client('reservations').where({
    product_id: reservation,
    dateofreservation,
    timerange,
  })
}

export async function check(
  reservation: string,
  dateofreservation = '2020-01-01'
): Promise<Reservation[]> {
  return client('reservations').where({
    product_id: reservation,
    dateofreservation,
  })
}
